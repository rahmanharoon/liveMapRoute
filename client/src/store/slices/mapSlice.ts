import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMapState } from '@interfaces/map.interface';
import { getStoredValue, setStoredValue, storageKeys } from '@utils/localStorage';

const initialState: IMapState = {
  zoom: getStoredValue(storageKeys.MAP_ZOOM, 13),
  center: getStoredValue(storageKeys.MAP_CENTER, [25.13932, 55.12843] as [number, number]),
  bearing: getStoredValue(storageKeys.MAP_BEARING, 0),
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
      setStoredValue(storageKeys.MAP_ZOOM, action.payload);
    },
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
      setStoredValue(storageKeys.MAP_CENTER, action.payload);
    },
    setBearing: (state, action: PayloadAction<number>) => {
      state.bearing = action.payload;
      setStoredValue(storageKeys.MAP_BEARING, action.payload);
    },
    updateMapState: (state, action: PayloadAction<Partial<IMapState>>) => {
      if (action.payload.zoom !== undefined) {
        state.zoom = action.payload.zoom;
        setStoredValue(storageKeys.MAP_ZOOM, action.payload.zoom);
      }
      if (action.payload.center !== undefined) {
        state.center = action.payload.center;
        setStoredValue(storageKeys.MAP_CENTER, action.payload.center);
      }
      if (action.payload.bearing !== undefined) {
        state.bearing = action.payload.bearing;
        setStoredValue(storageKeys.MAP_BEARING, action.payload.bearing);
      }
    },
  },
});

export const { setZoom, setCenter, setBearing, updateMapState } =
  mapSlice.actions;
export default mapSlice.reducer;
