import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/redux';
import { useColorScheme } from '../components/useColorScheme';
import { injectStore } from '../src/lib/axios';

// Inject the store into the axios instance
injectStore(store);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '(tabs)',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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

import { RootState } from '../src/redux';

// Component để điều hướng dựa trên trạng thái xác thực
function AuthenticatedApp() {
  console.log('AppNavigator - Rendering AuthenticatedApp');
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

function UnauthenticatedApp() {
  console.log('AppNavigator - Rendering UnauthenticatedApp');
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

function AppNavigator() {
  const { isInitialized, token } = useSelector((state: RootState) => state.auth);

  if (!isInitialized) {
    return null; // Giữ nguyên như cũ, vì splash screen đã được xử lý ở cấp cao hơn
  }

  return token ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function RootLayoutNav() {
 const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AppNavigator />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
