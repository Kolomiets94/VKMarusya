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

const posterPaths = [
  'brat.svg', 'brat-2.svg', 'legend-17.svg', 'dvizhenie-vverh.svg',
  'kholop.svg', 'cheburashka.svg', 'major-grom.svg', 'last-bogatyr.svg',
];

export const russianFilms: Show[] = films.map(([name, year, genre, summary], index) => ({
  id: 1000001 + index,
  name,
  premiered: year + '-01-01',
  genres: [genre],
  summary,
  rating: { average: null },
  image: {
    medium: `${process.env.PUBLIC_URL || '.'}/posters/${posterPaths[index]}`,
    original: `${process.env.PUBLIC_URL || '.'}/posters/${posterPaths[index]}`,
  },
}));

export const isLocalFilm = (id: number): boolean =>
  russianFilms.some((film) => film.id === id);

export const searchShows = async (query: string): Promise<Show[]> => {
  const normalizedQuery = query.trim().toLocaleLowerCase('ru');
  return russianFilms.filter((film) =>
    film.name.toLocaleLowerCase('ru').includes(normalizedQuery),
  );
};

export const getShows = async (): Promise<Show[]> => russianFilms;

export const getShow = async (id: number): Promise<Show> => {
  const film = russianFilms.find((item) => item.id === id);
  if (film) return film;

  const { data } = await client.get<Show>(`/shows/${id}`);
  return data;
};
