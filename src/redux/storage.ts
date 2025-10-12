import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A "noop" (no-operation) storage object that does nothing.
// This is used on the server during server-side rendering (SSR)
// to prevent errors, as there is no client-side storage available.
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// When running on the web, redux-persist needs a web-compatible storage.
// We have to import it dynamically to avoid errors on native.
const getWebStorage = () => {
  try {
    // Dynamically import the web storage
    return require('redux-persist/lib/storage').default;
  } catch (e) {
    // If the import fails (e.g., in a pure native environment), return noop storage
    return createNoopStorage();
  }
};

// Determine the correct storage based on the platform.
const storage =
  Platform.OS === 'web'
    ? // On the web, we need to differentiate between client and server.
      typeof window !== 'undefined'
      ? getWebStorage() // We are on the client, use web storage.
      : createNoopStorage() // We are on the server, use noop storage.
    : // On native platforms (iOS, Android), use AsyncStorage.
      AsyncStorage;

export default storage;