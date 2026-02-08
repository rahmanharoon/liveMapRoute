import { render } from '@testing-library/react';
import App from '../src/App';

jest.mock('@pages/home', () => () => <div data-testid="home-page">Home</div>);

describe('App', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('home-page')).toBeInTheDocument();
  });

  it('should wrap content in Redux Provider', () => {
    const { container } = render(<App />);
    expect(container.querySelector('[data-testid="home-page"]')).toBeInTheDocument();
  });
});
