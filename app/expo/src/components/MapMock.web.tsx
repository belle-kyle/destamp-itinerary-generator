import React, { forwardRef, useImperativeHandle } from 'react';
import { Text, View } from 'react-native';

export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default';

export const Marker = ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title?: string;
}) => (
  <View style={{ margin: 2 }}>
    {children ||
      (title ? (
        <Text style={{ fontSize: 10, color: '#333' }}>{title}</Text>
      ) : null)}
  </View>
);

export const Callout = ({ children }: { children?: React.ReactNode }) => (
  <View>{children}</View>
);
export const Polygon = () => null;
export const Polyline = () => null;
export const Circle = () => null;
export const Overlay = () => null;

export interface MapViewProps {
  children?: React.ReactNode;
  style?: import('react-native').ViewStyle;
  className?: string;
  initialRegion?: Record<string, unknown>;
  region?: Record<string, unknown>;
  provider?: string;
  onMapReady?: () => void;
  [key: string]: unknown;
}

const MapViewWeb = forwardRef((props: MapViewProps, ref) => {
  useImperativeHandle(ref, () => ({
    fitToCoordinates: () => {},
    fitToElements: () => {},
    fitToSuppliedMarkers: () => {},
    animateToRegion: () => {},
    animateToCoordinate: () => {},
    setCamera: () => {},
  }));

  React.useEffect(() => {
    if (props.onMapReady) {
      props.onMapReady();
    }
  }, []);

  return (
    <View
      className={props.className || 'h-64 w-full'}
      style={[
        {
          backgroundColor: '#E5E7EB',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#D1D5DB',
          padding: 16,
        },
        props.style,
      ]}
      testID="map-web-placeholder"
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#4B5563',
          marginBottom: 4,
        }}
      >
        🗺️ Map Preview
      </Text>
      <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
        Interactive maps are available on iOS & Android devices.
      </Text>
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {props.children}
      </View>
    </View>
  );
});

MapViewWeb.displayName = 'MapViewWeb';

export default MapViewWeb;
export const MapView = MapViewWeb;
export const MapViewDirections = () => null;
