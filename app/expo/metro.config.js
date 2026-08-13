// @ts-nocheck
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };

  const defaultResolveRequest = config.resolver.resolveRequest;

  config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
    resolveRequest: (context, moduleName, platform) => {
      if (platform === 'web') {
        if (
          moduleName === 'react-native-maps' ||
          moduleName === 'react-native-maps-directions'
        ) {
          return {
            filePath: path.resolve(__dirname, 'src/components/MapMock.web.tsx'),
            type: 'sourceFile',
          };
        }
      }
      if (defaultResolveRequest) {
        return defaultResolveRequest(context, moduleName, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  };

  return withNativeWind(config, { input: './global.css' });
})();
