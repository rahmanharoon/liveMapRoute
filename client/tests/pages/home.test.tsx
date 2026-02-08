import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import HomePage from '@pages/home';

jest.mock('@components/map', () => () => <div data-testid="map-component">Map</div>);
jest.mock('@hooks/useWebSocket', () => ({
  useWebSocket: () => ({ status: 'disconnected', reconnect: jest.fn() }),
}));

describe('HomePage', () => {
  it('should render map component', () => {
    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );
    expect(screen.getByTestId('map-component')).toBeInTheDocument();
  });

  it('should render layout container', () => {
    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );
    const layout = document.querySelector('[class*="layout"]');
    expect(layout).toBeInTheDocument();
  });
});
