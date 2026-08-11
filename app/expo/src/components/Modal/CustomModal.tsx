import React from 'react';
import { View } from 'react-native';

interface RightSlideModalProps {
  isVisible: boolean;
  children: string | React.JSX.Element | React.JSX.Element[];
  onClose: () => void;
}

function RightSlideModal({
  isVisible,
  children,
  onClose,
}: RightSlideModalProps) {
  if (!isVisible) return null;

  return (
    <View
      testID="modal"
      onStartShouldSetResponder={() => {
        onClose();
        return true;
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <View
        onStartShouldSetResponder={() => true}
        testID="modal-menus"
        style={{
          width: 300,
          height: 400,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
        }}
        className="-mx-0"
      >
        {children}
      </View>
    </View>
  );
}

export default RightSlideModal;
