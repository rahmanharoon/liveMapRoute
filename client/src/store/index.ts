import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';
import tripReducer from './slices/tripSlice';
import mapReducer from './slices/mapSlice';

export const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
    trip: tripReducer,
    map: mapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
