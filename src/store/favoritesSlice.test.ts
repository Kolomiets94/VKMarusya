import reducer, { toggleFavorite } from './favoritesSlice';

describe('favorites reducer', () => {
  test('adds a favorite and removes it when toggled again', () => {
    const initial = reducer(undefined, { type: '@@init' });
    const added = reducer(initial, toggleFavorite(1000001));
    expect(added).toContain(1000001);

    const removed = reducer(added, toggleFavorite(1000001));
    expect(removed).not.toContain(1000001);
  });

  test('ignores invalid identifiers', () => {
    const initial = [1000001];
    expect(reducer(initial, toggleFavorite(0))).toEqual(initial);
    expect(reducer(initial, toggleFavorite(-5))).toEqual(initial);
    expect(reducer(initial, toggleFavorite(1.5))).toEqual(initial);
  });
});
