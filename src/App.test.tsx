import { render, screen } from '@testing-library/react';
import App from './App';

test('renders movie catalogue', () => {
  render(<App />);
  expect(screen.getByText(/Find a movie for tonight/i)).toBeInTheDocument();
  expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
});
