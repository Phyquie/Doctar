import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import locationReducer from './slices/locationSlice';
import authReducer from './slices/authSlice';

// Create a safe storage that only works on client side
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// Use storage only if we're on client side, otherwise use noop storage
const safeStorage = typeof window !== 'undefined' ? storage : createNoopStorage();

// Persist config for location slice
const locationPersistConfig = {
  key: 'doctar-location',
  storage: safeStorage,
  whitelist: ['currentLocation', 'locationHistory'], // Only persist these fields
};

// Persist config for auth slice
const authPersistConfig = {
  key: 'doctar-auth',
  storage: safeStorage,
  whitelist: ['user', 'isAuthenticated', 'role', 'profile', 'preferences'], // Persist auth data
};

const persistedLocationReducer = persistReducer(locationPersistConfig, locationReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    location: persistedLocationReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// For JavaScript usage, we don't need TypeScript types
// If you want TypeScript support later, rename this file to index.ts
export default store;
