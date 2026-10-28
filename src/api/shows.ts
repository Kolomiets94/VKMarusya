import axios from 'axios';

export interface Show {
  id: number;
  name: string;
  premiered: string | null;
  genres: string[];
  rating: { average: number | null };
  summary: string | null;
  image: { medium: string; original: string } | null;
}

const client = axios.create({ baseURL: 'https://api.tvmaze.com' });
const tmdbClient = axios.create({ baseURL: 'https://vkmarusya-tmdb-proxy.ekaterinsburg96.workers.dev' });
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

const films: Array<[string, string, string, string]> = [
  ['Брат', '1997', 'Драма', 'Данила Багров приезжает в Санкт-Петербург к старшему брату и оказывается втянут в криминальный мир.'],
  ['Брат 2', '2000', 'Боевик', 'Данила Багров отправляется в США, чтобы помочь брату погибшего друга.'],
  ['Легенда №17', '2013', 'Спорт', 'История становления хоккеиста Валерия Харламова и его пути к знаменитому матчу сборной СССР против Канады.'],
  ['Движение вверх', '2017', 'Спорт', 'Спортивная драма о сборной СССР по баскетболу и финале Олимпийских игр 1972 года.'],
  ['Холоп', '2019', 'Комедия', 'Избалованный молодой человек попадает в постановочный мир, где его убеждают, что он оказался в деревне XIX века.'],
  ['Чебурашка', '2023', 'Семейный', 'Необычный пушистый герой оказывается в приморском городе и меняет жизнь садовника Геннадия.'],
  ['Майор Гром: Чумной Доктор', '2021', 'Боевик', 'Петербургский полицейский Игорь Гром расследует преступления таинственного Чумного Доктора.'],
  ['Последний богатырь', '2017', 'Фэнтези', 'Москвич Иван оказывается в сказочном Белогорье и становится участником борьбы сказочных героев.'],
];

const localShows: Show[] = films.map(([name, year, genre, summary], index) => ({
  id: 1000001 + index,
  name,
  premiered: year + '-01-01',
  genres: [genre],
  summary,
  rating: { average: null },
  image: null,
}));

const withRealPoster = async (show: Show): Promise<Show> => {
  try {
    const { data } = await tmdbClient.get('/search/movie', {
      params: {
        query: show.name,
        year: show.premiered?.slice(0, 4),
        language: 'ru-RU',
        include_adult: false,
      },
    });
    const results: Array<{ title: string; release_date?: string; poster_path: string | null }> =
      data.results ?? [];
    const year = show.premiered?.slice(0, 4);
    const match =
      results.find((movie) => movie.title.toLocaleLowerCase('ru') === show.name.toLocaleLowerCase('ru')
        && movie.release_date?.slice(0, 4) === year)
      ?? results.find((movie) => movie.release_date?.slice(0, 4) === year)
      ?? results[0];
    if (!match?.poster_path) return show;

    const poster = `${TMDB_IMAGE_BASE}/w500${match.poster_path}`;
    return { ...show, image: { medium: poster, original: `${TMDB_IMAGE_BASE}/original${match.poster_path}` } };
  } catch {
    // Keep the catalogue usable if TMDB is unavailable or not configured.
    return show;
  }
};

const withPosters = async (shows: Show[]): Promise<Show[]> =>
  Promise.all(shows.map(withRealPoster));

export const isLocalFilm = (id: number): boolean =>
  localShows.some((film) => film.id === id);

export const searchShows = async (query: string): Promise<Show[]> => {
  const normalizedQuery = query.trim().toLocaleLowerCase('ru');
  const matches = localShows.filter((film) =>
    film.name.toLocaleLowerCase('ru').includes(normalizedQuery),
  );
  return withPosters(matches);
};

export const getShows = async (): Promise<Show[]> => withPosters(localShows);

export const getShow = async (id: number): Promise<Show> => {
  const film = localShows.find((item) => item.id === id);
  if (film) return (await withPosters([film]))[0];

  const { data } = await client.get<Show>(`/shows/${id}`);
  return data;
};
