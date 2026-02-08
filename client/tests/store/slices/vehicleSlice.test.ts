import vehicleReducer, {
  setVehicleData,
  addPathEvent,
  clearVehicleData,
  setMaxHistorySize,
} from '@store/slices/vehicleSlice';
import { IVehicleData, IPathEvent } from '@interfaces/vehicle.interface';

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

  it('should handle addPathEvent', () => {
    const event: IPathEvent = {
      type: 'stop',
      latitude: 25.1,
      longitude: 55.1,
      timestamp: Date.now(),
    };
    const state = vehicleReducer(undefined, addPathEvent(event));
    expect(state.pathEvents).toHaveLength(1);
    expect(state.pathEvents[0]).toEqual(event);
  });

  it('should limit pathEvents to maxPathEvents', () => {
    let state = vehicleReducer(undefined, setMaxHistorySize(2));
    state = vehicleReducer(state, setMaxHistorySize(2));
    const event: IPathEvent = {
      type: 'stop',
      latitude: 25.1,
      longitude: 55.1,
      timestamp: Date.now(),
    };
    for (let i = 0; i < 55; i++) {
      state = vehicleReducer(
        state,
        addPathEvent({ ...event, timestamp: event.timestamp + i })
      );
    }
    expect(state.pathEvents.length).toBeLessThanOrEqual(50);
  });
});
