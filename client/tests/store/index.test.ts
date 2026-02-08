import { store } from '@store/index';
import type { RootState, AppDispatch } from '@store/index';

describe('store', () => {
  it('should have correct initial state shape', () => {
    const state = store.getState();
    expect(state).toHaveProperty('vehicle');
    expect(state).toHaveProperty('trip');
    expect(state).toHaveProperty('map');
    expect(state.vehicle).toHaveProperty('currentVehicle', null);
    expect(state.vehicle).toHaveProperty('positionHistory', []);
    expect(state.trip).toHaveProperty('isTripActive', false);
    expect(state.map).toHaveProperty('zoom');
    expect(state.map).toHaveProperty('center');
    expect(state.map).toHaveProperty('bearing');
  });

  it('should dispatch actions', () => {
    const prevZoom = store.getState().map.zoom;
    store.dispatch({ type: 'map/setZoom', payload: 14 });
    expect(store.getState().map.zoom).toBe(14);
    store.dispatch({ type: 'map/setZoom', payload: prevZoom });
  });

  it('should export RootState type', () => {
    const state: RootState = store.getState();
    expect(state).toBeDefined();
  });

  it('should export AppDispatch type', () => {
    const dispatch: AppDispatch = store.dispatch;
    expect(typeof dispatch).toBe('function');
  });
});
