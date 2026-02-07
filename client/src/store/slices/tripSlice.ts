import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ITripMetrics } from '@interfaces/trip.interface';

interface ITripState {
  metrics: ITripMetrics | null;
  isTripActive: boolean;
}

const initialState: ITripState = {
  metrics: null,
  isTripActive: false,
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    startTrip: (state, action: PayloadAction<number>) => {
      state.isTripActive = true;
      state.metrics = {
        mileage: 0,
        averageSpeed: 0,
        startTime: action.payload,
      };
    },
    updateTripMetrics: (state, action: PayloadAction<ITripMetrics>) => {
      if (state.metrics) {
        state.metrics = action.payload;
      }
    },
    endTrip: (state) => {
      state.isTripActive = false;
    },
    resetTrip: (state) => {
      state.metrics = null;
      state.isTripActive = false;
    },
  },
});

export const { startTrip, updateTripMetrics, endTrip, resetTrip } =
  tripSlice.actions;
export default tripSlice.reducer;
