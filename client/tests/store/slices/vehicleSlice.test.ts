import vehicleReducer, {
  setVehicleData,
  clearVehicleData,
  setMaxHistorySize,
} from '@store/slices/vehicleSlice';
import { IVehicleData } from '@interfaces/vehicle.interface';

describe('vehicleSlice', () => {
  const mockVehicleData: IVehicleData = {
    plateNumber: 'DXB-CX-36357',
    latitude: 25.13932,
    longitude: 55.12843,
    status: 'moving',
    timestamp: Date.now(),
    heading: 90,
    speed: 60,
  };

  it('should handle initial state', () => {
    const state = vehicleReducer(undefined, { type: 'unknown' });
    expect(state.currentVehicle).toBeNull();
    expect(state.positionHistory).toEqual([]);
    expect(state.maxHistorySize).toBe(100);
  });

  it('should handle setVehicleData', () => {
    const state = vehicleReducer(undefined, setVehicleData(mockVehicleData));
    expect(state.currentVehicle).toEqual(mockVehicleData);
    expect(state.positionHistory).toHaveLength(1);
  });

  it('should handle clearVehicleData', () => {
    const stateWithData = vehicleReducer(
      undefined,
      setVehicleData(mockVehicleData)
    );
    const state = vehicleReducer(stateWithData, clearVehicleData());
    expect(state.currentVehicle).toBeNull();
    expect(state.positionHistory).toEqual([]);
  });

  it('should limit history size', () => {
    let state = vehicleReducer(undefined, setMaxHistorySize(2));
    state = vehicleReducer(state, setVehicleData(mockVehicleData));
    state = vehicleReducer(
      state,
      setVehicleData({ ...mockVehicleData, timestamp: Date.now() + 1000 })
    );
    state = vehicleReducer(
      state,
      setVehicleData({ ...mockVehicleData, timestamp: Date.now() + 2000 })
    );
    expect(state.positionHistory).toHaveLength(2);
  });
});
