import tripReducer, {
  startTrip,
  updateTripMetrics,
  endTrip,
  resetTrip,
} from '@store/slices/tripSlice';
import { ITripMetrics } from '@interfaces/trip.interface';

describe('tripSlice', () => {
  const mockMetrics: ITripMetrics = {
    mileage: 10.5,
    averageSpeed: 60,
    startTime: Date.now(),
  };

  it('should handle initial state', () => {
    const state = tripReducer(undefined, { type: 'unknown' });
    expect(state.metrics).toBeNull();
    expect(state.isTripActive).toBe(false);
  });

  it('should handle startTrip', () => {
    const startTime = Date.now();
    const state = tripReducer(undefined, startTrip(startTime));
    expect(state.isTripActive).toBe(true);
    expect(state.metrics?.startTime).toBe(startTime);
    expect(state.metrics?.mileage).toBe(0);
    expect(state.metrics?.averageSpeed).toBe(0);
  });

  it('should handle updateTripMetrics', () => {
    const stateWithTrip = tripReducer(undefined, startTrip(Date.now()));
    const state = tripReducer(stateWithTrip, updateTripMetrics(mockMetrics));
    expect(state.metrics).toEqual(mockMetrics);
  });

  it('should handle endTrip', () => {
    const stateWithTrip = tripReducer(undefined, startTrip(Date.now()));
    const state = tripReducer(stateWithTrip, endTrip());
    expect(state.isTripActive).toBe(false);
  });

  it('should handle resetTrip', () => {
    const stateWithTrip = tripReducer(undefined, startTrip(Date.now()));
    const state = tripReducer(stateWithTrip, resetTrip());
    expect(state.metrics).toBeNull();
    expect(state.isTripActive).toBe(false);
  });
});
