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
const wikipediaClient = axios.create({ baseURL: 'https://ru.wikipedia.org/w/api.php' });

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

type WikipediaPage = {
  title: string;
  thumbnail?: { source: string };
  original?: { source: string };
};

const withRealPoster = async (show: Show): Promise<Show> => {
  try {
    const year = show.premiered?.slice(0, 4) ?? '';
    const { data } = await wikipediaClient.get('', {
      params: {
        action: 'query',
        generator: 'search',
        gsrsearch: `${show.name} фильм ${year}`,
        gsrlimit: 6,
        prop: 'pageimages',
        piprop: 'thumbnail|original',
        pithumbsize: 500,
        format: 'json',
        origin: '*',
      },
    });
    const pages = Object.values((data.query?.pages ?? {}) as Record<string, WikipediaPage>);
    const normalize = (value: string) => value.toLocaleLowerCase('ru').replace(/[^\p{L}\p{N}]+/gu, '');
    const match = pages.find((page) => normalize(page.title).includes(normalize(show.name)))
      ?? pages.find((page) => page.thumbnail?.source || page.original?.source);
    const poster = match?.original?.source ?? match?.thumbnail?.source;
    if (!poster) return show;

    return { ...show, image: { medium: match?.thumbnail?.source ?? poster, original: poster } };
  } catch {
    // Keep the catalogue usable if Wikipedia is unavailable or has no matching image.
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
