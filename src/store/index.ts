import { configureStore } from '@reduxjs/toolkit';
import favorites from './favoritesSlice';

export const store = configureStore({ reducer: { favorites } });

// Persist outside reducers: reducers must stay pure and deterministic.
store.subscribe(() => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('movie-favorites', JSON.stringify(store.getState().favorites));
    }
  } catch {
    // The app remains usable when storage is disabled or full.
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
