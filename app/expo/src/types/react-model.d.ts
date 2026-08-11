// Redirect react-model to its shipped dist declarations (dist/*.d.ts) instead
// of its `types` field (src/index), which points at TS sources that tsc would
// otherwise compile (skipLibCheck does not cover .ts sources).

export * from 'react-model/dist/index';
