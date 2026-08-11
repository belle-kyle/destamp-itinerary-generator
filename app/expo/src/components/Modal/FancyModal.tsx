import React from 'react';
import { View } from 'react-native';

interface FancyModalProps {
  isVisible: boolean;
  children: string | React.JSX.Element | React.JSX.Element[];
  bgColor?: string;
}

export default function FancyModal({
  isVisible,
  children,
  bgColor,
}: FancyModalProps) {
  if (!isVisible) return null;

  return (
    <View
      testID="fancy-modal"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: bgColor || 'rgba(245,223,200,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <View className="w-80 self-center rounded-3xl bg-white px-3 py-5">
        {children}
      </View>
    </View>
  );
}
