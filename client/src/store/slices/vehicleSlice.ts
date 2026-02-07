import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IVehicleData, IPathEvent } from '@interfaces/vehicle.interface';

interface IVehicleState {
  currentVehicle: IVehicleData | null;
  positionHistory: IVehicleData[];
  pathEvents: IPathEvent[];
  maxHistorySize: number;
  maxPathEvents: number;
}

const initialState: IVehicleState = {
  currentVehicle: null,
  positionHistory: [],
  pathEvents: [],
  maxHistorySize: 100,
  maxPathEvents: 50,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicleData: (state, action: PayloadAction<IVehicleData>) => {
      state.currentVehicle = action.payload;
      
      // Add to history
      state.positionHistory.push(action.payload);
      
      // Keep only last N positions
      if (state.positionHistory.length > state.maxHistorySize) {
        state.positionHistory.shift();
      }
    },
    addPathEvent: (state, action: PayloadAction<IPathEvent>) => {
      state.pathEvents.push(action.payload);
      if (state.pathEvents.length > state.maxPathEvents) {
        state.pathEvents.shift();
      }
    },
    clearVehicleData: (state) => {
      state.currentVehicle = null;
      state.positionHistory = [];
      state.pathEvents = [];
    },
    setMaxHistorySize: (state, action: PayloadAction<number>) => {
      state.maxHistorySize = action.payload;
    },
  },
});

export const { setVehicleData, addPathEvent, clearVehicleData, setMaxHistorySize } =
  vehicleSlice.actions;
export default vehicleSlice.reducer;
