# VK Marusya — Movie Discovery SPA

**[Live demo](https://kolomiets94.github.io/VKMarusya/)**

A responsive React + TypeScript portfolio application for browsing a curated selection of eight Russian films, viewing details and saving favorites.

## Features

- Curated catalogue of eight Russian films
- Real film posters loaded from TMDB when an API key is configured
- Graceful poster fallback when a key, network response or image is unavailable
- Debounced title search
- Film details and favorites persisted in localStorage
- Loading, empty-result and error states
- Protection against stale asynchronous responses
- Responsive layout and a not-found route

## Tech stack

React 19 · TypeScript · Redux Toolkit · React Redux · React Router · Axios · Jest · React Testing Library · CSS

## Routes

The app uses `HashRouter`, so routes in the deployed demo include a hash:

- `/#/` — catalogue and search
- `/#/movie/1000001` — details for a locally curated film
- `/#/unknown` — not-found route

## Run locally

Requires Node.js and npm.

```bash
npm ci
npm start
```

To load official film posters, create a TMDB API key at [TMDB API settings](https://www.themoviedb.org/settings/api), copy `.env.example` to `.env`, and set `REACT_APP_TMDB_API_KEY` to your key. The catalogue still works without the key, but poster images are unavailable and the UI shows its fallback.

Run tests:

```bash
npm test -- --watchAll=false
```

Create a production build:

```bash
npm run build
```

## Data

The catalogue and search use the `films` list in `src/api/shows.ts` (IDs 1000001–1000008), with editorial descriptions. Poster artwork is resolved through the TMDB search API. Posters and film metadata are provided by TMDB; this product uses the TMDB API but is not endorsed or certified by TMDB. `getShow(id)` also supports fetching a TVmaze show by ID. This project is a discovery catalogue and does not stream films.

## Author

**Alexander Kolomiets** — Junior Frontend Developer (React / TypeScript)

- GitHub: https://github.com/Kolomiets94
- Email: Kolomiets94@yandex.ru
- Telegram: @Kolomiets94
