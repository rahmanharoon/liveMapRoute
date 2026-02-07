import mapReducer, {
  setZoom,
  setCenter,
  setBearing,
  updateMapState,
} from '@store/slices/mapSlice';

describe('mapSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should handle initial state', () => {
    const state = mapReducer(undefined, { type: 'unknown' });
    expect(state.zoom).toBe(13);
    expect(state.center).toEqual([25.13932, 55.12843]);
    expect(state.bearing).toBe(0);
  });

  it('should handle setZoom', () => {
    const state = mapReducer(undefined, setZoom(15));
    expect(state.zoom).toBe(15);
  });

  it('should handle setCenter', () => {
    const newCenter: [number, number] = [25.2, 55.2];
    const state = mapReducer(undefined, setCenter(newCenter));
    expect(state.center).toEqual(newCenter);
  });

  it('should handle setBearing', () => {
    const state = mapReducer(undefined, setBearing(90));
    expect(state.bearing).toBe(90);
  });

  it('should handle updateMapState', () => {
    const updates = {
      zoom: 14,
      center: [25.15, 55.15] as [number, number],
      bearing: 45,
    };
    const state = mapReducer(undefined, updateMapState(updates));
    expect(state.zoom).toBe(14);
    expect(state.center).toEqual([25.15, 55.15]);
    expect(state.bearing).toBe(45);
  });
});
