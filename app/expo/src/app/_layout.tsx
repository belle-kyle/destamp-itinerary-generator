import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ClerkProvider } from '@clerk/clerk-expo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { supabase } from 'config/initSupabase';
import { fetch } from 'cross-fetch';

import { AuthProvider } from '~/context/AuthProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// The old deployed backend (cpu-destamp.onrender.com) has been torn down -
// point at the local dev server started by `pnpm dev` (packages/db) instead.
// `localhost` reaches the host Mac from the iOS Simulator, but the Android
// emulator has its own loopback and needs the documented 10.0.2.2 alias
// instead. Neither works from a physical device on either platform - that
// needs the host machine's actual LAN IP substituted in here.
const URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

const httpLink = createHttpLink({
  uri: URL,
  fetch,
});

const authLink = setContext(async (_, { headers }) => {
  const token = (await supabase.auth.getSession()).data.session?.access_token;

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
    PoppinsThin: require('../../assets/fonts/Poppins-Thin.ttf'),
    PoppinsMedium: require('../../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBold: require('../../assets/fonts/Poppins-Bold.ttf'),
    PoppinsBlack: require('../../assets/fonts/Poppins-Black.ttf'),
    PoppinsSemiBold: require('../../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsExtraBold: require('../../assets/fonts/Poppins-ExtraBold.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AutocompleteDropdownContextProvider>
        <AuthProvider>
          <ClerkProvider
            publishableKey={
              Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY as string
            }
          >
            <ApolloProvider client={client}>
              <Stack>
                <Stack.Screen
                  name="business/(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="traveler/(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </ApolloProvider>
          </ClerkProvider>
        </AuthProvider>
      </AutocompleteDropdownContextProvider>
    </ThemeProvider>
  );
}

export { RootLayoutNav };
