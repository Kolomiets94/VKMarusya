# VK Marusya — Movie Discovery SPA

**[Live demo](https://kolomiets94.github.io/VKMarusya/)**

A responsive React + TypeScript portfolio application for browsing a local editorial selection of eight Russian films, viewing details and saving favorites.

## Features

- Local catalogue of eight Russian films
- Debounced title search
- Film details and fallback artwork when a poster is unavailable
- Favorites managed with Redux Toolkit and persisted in localStorage
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

Run tests:

```bash
npm test -- --watchAll=false
```

Create a production build:

```bash
npm run build
```

## Data

The catalogue and search use the `russianFilms` array in `src/api/shows.ts` (IDs 1000001–1000008), with editorial descriptions. `getShow(id)` also supports fetching a TVmaze show by ID, but externally fetched shows are not added to the local favorites list. See [TVmaze API](https://www.tvmaze.com/api). This project is a discovery catalogue and does not stream films.

## Author

**Alexander Kolomiets** — Junior Frontend Developer (React / TypeScript)

- GitHub: https://github.com/Kolomiets94
- Email: Kolomiets94@yandex.ru
- Telegram: @Kolomiets94
