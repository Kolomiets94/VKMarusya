import { getShow, getShows, isLocalFilm, searchShows } from './shows';

describe('local film catalogue', () => {
  test('returns the local catalogue without external requests', async () => {
    const shows = await getShows();
    expect(shows).toHaveLength(8);
    expect(shows[0].name).toBe('Брат');
  });

  test('searches film titles without case sensitivity or surrounding spaces', async () => {
    const results = await searchShows('  БРАТ  ');
    expect(results.map((show) => show.name)).toEqual(['Брат', 'Брат 2']);
  });

  test('returns local details and identifies local films', async () => {
    await expect(getShow(1000001)).resolves.toMatchObject({ id: 1000001, name: 'Брат' });
    expect(isLocalFilm(1000001)).toBe(true);
    expect(isLocalFilm(123)).toBe(false);
  });
});
