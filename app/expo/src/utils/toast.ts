import { Platform, ToastAndroid } from 'react-native';

/**
 * Cross-platform toast helper.
 * - Android: uses ToastAndroid
 * - iOS / Web: falls back to console.info (non-intrusive)
 */
export const toast = (message: string): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // On web/iOS, log the message; it won't crash.
    console.info('[Toast]', message);
  }
};
