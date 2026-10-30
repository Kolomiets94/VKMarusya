# VKMarusya — Movie Discovery SPA

**[Live demo](https://kolomiets94.github.io/VKMarusya/)**

A responsive movie discovery catalogue built with React 19 and TypeScript. Users can browse a curated selection of eight Russian films, search titles, open details and save favorites.

## Features

- Curated catalogue of eight Russian films
- Debounced title search
- Film details and favorites persisted in `localStorage`
- Poster thumbnails discovered through the public Russian Wikipedia API
- Graceful poster fallback when an image is unavailable
- Loading, empty-result and error states
- Protection against stale asynchronous responses
- Responsive layout and a not-found route

## Tech stack

React 19 · TypeScript · Redux Toolkit · React Redux · React Router · Axios · Jest · React Testing Library · CSS

## Technical highlights

- Redux Toolkit manages the catalogue and favorites state.
- Search input is debounced to avoid unnecessary work while typing.
- Asynchronous requests are handled with protection against stale responses.
- The interface includes explicit loading, empty and error states.
- Jest and React Testing Library are used for component/application tests.

## Routes

The application uses `HashRouter`; deployed routes include a hash:

- `/#/` — catalogue and search
- `/#/movie/1000001` — details for a locally curated film
- `/#/unknown` — not-found route

## Run locally

Requires Node.js and npm.

```bash
git clone https://github.com/Kolomiets94/VKMarusya.git
cd VKMarusya
npm ci
npm start
```

Run tests:

```bash
npm test -- --watchAll=false
```

Create a production build:

```bash
npm run build
```

No API key or environment file is required for poster lookup. The app requests matching article thumbnails from the public Russian Wikipedia API and continues to work if the API is unavailable or no suitable image is found.

## Data and scope

The catalogue and search use the `films` list in `src/api/shows.ts` (IDs 1000001–1000008), with editorial descriptions. Poster thumbnails are discovered via the public Russian Wikipedia API. `getShow(id)` also supports fetching a TVmaze show by ID. This project is a discovery catalogue and does not stream films.

## More projects

- [AudioPlayer — React + TypeScript + Express](https://github.com/Kolomiets94/audioplayer)
- [TravelBlog — React + TypeScript SPA](https://github.com/Kolomiets94/travel-blog)
- [Open-source contribution: RuView #2269](https://github.com/ruvnet/RuView/pull/2269)
- [Open-source contribution: VKCOM/elephize #185](https://github.com/VKCOM/elephize/pull/185)
- [Open-source contribution: Gravity UI #1528](https://github.com/gravity-ui/page-constructor/pull/1528)

## Author

**Alexander Kolomiets** — Junior Frontend Developer (React / TypeScript)

- GitHub: https://github.com/Kolomiets94
- Email: Kolomiets94@yandex.ru
- Telegram: @Kolomiets94
