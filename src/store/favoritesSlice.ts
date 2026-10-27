import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'movie-favorites';

const loadFavorites = (): number[] => {
  try {
    if (typeof window === 'undefined') return [];
    const saved: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0,
    );
  } catch {
    // Storage can be unavailable or contain invalid JSON.
    return [];
  }
};

const slice = createSlice({
  name: 'favorites',
  initialState: loadFavorites(),
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!Number.isInteger(id) || id <= 0) return;

      const index = state.indexOf(id);
      if (index >= 0) state.splice(index, 1);
      else state.push(id);
    },
  },
});

export const { toggleFavorite } = slice.actions;
export default slice.reducer;
