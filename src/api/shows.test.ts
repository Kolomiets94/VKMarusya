import { getShow, getShows, isLocalFilm, searchShows } from './shows';

describe('local film catalogue', () => {
  test('returns the local catalogue without requiring an external API key', async () => {
    const shows = await getShows();
    expect(shows).toHaveLength(8);
    expect(shows[0].name).toBe('Брат');
    expect(shows.every((show) => show.id >= 1000001 && show.id <= 1000008)).toBe(true);
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
