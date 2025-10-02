import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  role: null, // 'patient' or 'doctor'
  profile: null,
  preferences: {
    notifications: true,
    emailUpdates: true,
    smsUpdates: false
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Authentication actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.profile = action.payload.profile;
      state.error = null;
    },
    
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.profile = null;
      state.error = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.profile = null;
      state.error = null;
      state.preferences = {
        notifications: true,
        emailUpdates: true,
        smsUpdates: false
      };
      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    },
    
    // Registration actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.profile = action.payload.profile;
      state.error = null;
    },
    
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.profile = null;
      state.error = action.payload;
    },
    
    // Profile management
    updateProfile: (state, action) => {
      if (action.payload.user) {
        state.user = { ...state.user, ...action.payload.user };
      }
      if (action.payload.profile) {
        state.profile = { ...state.profile, ...action.payload.profile };
      }
    },
    
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    // Password reset
    resetPasswordStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    resetPasswordSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    
    resetPasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Preferences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  updateProfile,
  updateUser,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  updatePreferences,
  clearError,
  setLoading
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectRole = (state) => state.auth.role;
export const selectProfile = (state) => state.auth.profile;
export const selectPreferences = (state) => state.auth.preferences;
