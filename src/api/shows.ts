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

// Use the known article title first; search is only a fallback.
const films: Array<[string, string, string, string, string]> = [
  ['Брат', '1997', 'Драма', 'Данила Багров приезжает в Санкт-Петербург к старшему брату и оказывается втянут в криминальный мир.', 'Брат (фильм)'],
  ['Брат 2', '2000', 'Боевик', 'Данила Багров отправляется в США, чтобы помочь брату погибшего друга.', 'Брат 2'],
  ['Легенда №17', '2013', 'Спорт', 'История становления хоккеиста Валерия Харламова и его пути к знаменитому матчу сборной СССР против Канады.', 'Легенда № 17'],
  ['Движение вверх', '2017', 'Спорт', 'Спортивная драма о сборной СССР по баскетболу и финале Олимпийских игр 1972 года.', 'Движение вверх (фильм)'],
  ['Холоп', '2019', 'Комедия', 'Избалованный молодой человек попадает в постановочный мир, где его убеждают, что он оказался в деревне XIX века.', 'Холоп (фильм)'],
  ['Чебурашка', '2023', 'Семейный', 'Необычный пушистый герой оказывается в приморском городе и меняет жизнь садовника Геннадия.', 'Чебурашка (фильм, 2022)'],
  ['Майор Гром: Чумной Доктор', '2021', 'Боевик', 'Петербургский полицейский Игорь Гром расследует преступления таинственного Чумного Доктора.', 'Майор Гром: Чумной Доктор'],
  ['Последний богатырь', '2017', 'Фэнтези', 'Москвич Иван оказывается в сказочном Белогорье и становится участником борьбы сказочных героев.', 'Последний богатырь'],
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

const imageFromPages = (pages: WikipediaPage[]): Show['image'] => {
  const page = pages.find((item) => item.thumbnail?.source || item.original?.source);
  const source = page?.thumbnail?.source ?? page?.original?.source;
  return source ? { medium: source, original: page?.original?.source ?? source } : null;
};

const withRealPoster = async (show: Show): Promise<Show> => {
  const film = films.find(([name]) => name === show.name);
  if (!film) return show;

  try {
    const exact = await wikipediaClient.get('', {
      params: {
        action: 'query',
        titles: film[4],
        prop: 'pageimages',
        piprop: 'thumbnail|original',
        pithumbsize: 600,
        format: 'json',
        origin: '*',
      },
    });
    let image = imageFromPages(Object.values((exact.data.query?.pages ?? {}) as Record<string, WikipediaPage>));

    if (!image) {
      const search = await wikipediaClient.get('', {
        params: {
          action: 'query',
          generator: 'search',
          gsrsearch: `${show.name} фильм ${film[1]}`,
          gsrlimit: 8,
          prop: 'pageimages',
          piprop: 'thumbnail|original',
          pithumbsize: 600,
          format: 'json',
          origin: '*',
        },
      });
      const pages = Object.values((search.data.query?.pages ?? {}) as Record<string, WikipediaPage>);
      const normalizedName = show.name.toLocaleLowerCase('ru').replace(/[^\p{L}\p{N}]+/gu, '');
      const match = pages.find((page) =>
        page.title.toLocaleLowerCase('ru').replace(/[^\p{L}\p{N}]+/gu, '').includes(normalizedName),
      );
      image = match
        ? imageFromPages([match])
        : imageFromPages(pages);
    }

    return image ? { ...show, image } : show;
  } catch {
    // Keep the catalogue usable if Wikipedia is unavailable or has no image.
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
