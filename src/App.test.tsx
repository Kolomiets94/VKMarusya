import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';

test('renders movie catalogue shell', () => {
  render(<Provider store={store}><MemoryRouter><App /></MemoryRouter></Provider>);
  expect(screen.getByText(/Find something worth watching/i)).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /search shows/i })).toBeInTheDocument();
});
