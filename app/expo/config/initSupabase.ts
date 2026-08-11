import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

import 'react-native-url-polyfill/auto';

// SecureStore has no web implementation — fall back to localStorage there
// (expo-secure-store throws on web, which would break auth/session handling).
const webStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
};

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') return webStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') return webStorage.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') return webStorage.removeItem(key);
    return SecureStore.deleteItemAsync(key);
  },
};

const url = Constants.expoConfig?.extra?.SUPABASE_URL as string;
const key = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
