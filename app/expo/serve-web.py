import http.server
import os
import re
import urllib.parse
from http.server import SimpleHTTPRequestHandler

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
PORT = int(os.environ.get('PORT', 8099))


class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        # SPA fallback: unknown routes (no file extension) serve index.html
        p = urllib.parse.urlparse(path).path
        if not os.path.splitext(p)[1] and p != '/':
            candidate = os.path.join(ROOT, p.lstrip('/'))
            if not os.path.isfile(candidate):
                return os.path.join(ROOT, 'index.html')
        return super().translate_path(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # quiet


if __name__ == '__main__':
    os.chdir(ROOT)
    httpd = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), SPAHandler)
    print(f'SPA preview serving {ROOT} at http://localhost:{PORT}')
    httpd.serve_forever()
