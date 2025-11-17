// src/config/firebase.config.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import Constants from 'expo-constants';

/**
 * Firebase Configuration
 * Get these values from Firebase Console → Project Settings → General
 * Add them to your .env file or app.json extra config
 */
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required fields
const requiredFields = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.warn('⚠️ Missing Firebase configuration fields:', missingFields);
  console.warn('Please add these to your .env file or app.json extra config');
}

// Initialize Firebase
let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
  console.log('📋 Project ID:', firebaseConfig.projectId);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}

// Initialize Firebase Cloud Messaging (web only, for Expo web)
// For native (iOS/Android), we use expo-notifications with FCM
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported && app) {
        messaging = getMessaging(app);
        console.log('✅ Firebase Messaging initialized');
      } else {
        console.warn('⚠️ Firebase Messaging not supported in this environment');
      }
    })
    .catch((error) => {
      console.error('❌ Error checking Firebase Messaging support:', error);
    });
}

export { app, messaging, firebaseConfig };

/**
 * Helper to check if Firebase is properly configured
 */
export const isFirebaseConfigured = (): boolean => {
  return missingFields.length === 0 && app !== null;
};

/**
 * Get Firebase project info for debugging
 */
export const getFirebaseInfo = () => {
  return {
    configured: isFirebaseConfigured(),
    projectId: firebaseConfig.projectId,
    messagingSenderId: firebaseConfig.messagingSenderId,
    hasApp: app !== null,
    hasMessaging: messaging !== null,
    missingFields,
  };
};
