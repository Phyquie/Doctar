import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: {
    name: 'Bengaluru',
    lat: 12.9716,
    lng: 77.5946,
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India'
  },
  isLocationPickerOpen: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    
    setLocationPickerOpen: (state, action) => {
      state.isLocationPickerOpen = action.payload;
    },
  },
});

export const {
  setLocation,
  setLocationPickerOpen,
} = locationSlice.actions;

export default locationSlice.reducer;

// Selectors
export const selectCurrentLocation = (state) => state.location.currentLocation;
export const selectIsLocationPickerOpen = (state) => state.location.isLocationPickerOpen;
