import React from 'react';
import { View } from 'react-native';

interface BottomHalfModalProps {
  isVisible: boolean;
  children: string | React.JSX.Element | React.JSX.Element[];
  onClose: () => void;
  testID?: string;
}

// react-native-modal is unreliable under react-native-web (often fails to
// mount/animate, leaving the UI "stuck"). Use an absolute overlay View, which
// renders consistently on web, native, and in tests.
function BottomHalfModal({
  isVisible,
  children,
  onClose,
  testID = 'modal',
}: BottomHalfModalProps) {
  if (!isVisible) return null;

  return (
    <View
      testID={testID}
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
        justifyContent: 'flex-end',
        zIndex: 1000,
      }}
    >
      <View
        onStartShouldSetResponder={() => true}
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 12,
          paddingVertical: 20,
        }}
        className="-mx-0"
      >
        <View
          testID="modal-menus"
          style={{
            alignSelf: 'center',
            width: 48,
            height: 8,
            borderRadius: 8,
            backgroundColor: '#cbd5e1',
            marginBottom: 8,
          }}
        />
        {children}
      </View>
    </View>
  );
}

export default BottomHalfModal;
