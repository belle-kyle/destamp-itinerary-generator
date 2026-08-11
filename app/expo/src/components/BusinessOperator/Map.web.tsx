import React from 'react';
import { Text, View } from 'react-native';

// react-native-maps has no web implementation (it crashes the bundle on web),
// so web gets a placeholder. Native builds use Map.tsx via metro platform
// resolution (Map.web.tsx wins on web, Map.tsx elsewhere).
const MapWeb = () => (
  <View
    className="h-48 w-full items-center justify-center rounded-2xl border-2 border-gray-300"
    testID="map-web-placeholder"
  >
    <Text className="font-poppins text-sm text-gray-500">
      Map is not available on web
    </Text>
  </View>
);

export default MapWeb;
