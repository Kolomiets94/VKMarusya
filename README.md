# VK Marusya — Movie Discovery SPA

**[Live demo](https://kolomiets94.github.io/VKMarusya/)**

A responsive React + TypeScript portfolio application for browsing a curated selection of eight Russian films, viewing details and saving favorites.

## Features

- Curated catalogue of eight Russian films
- Poster thumbnails discovered through the public Russian Wikipedia API — no API key or secret required
- Graceful poster fallback when an image is unavailable
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

No API key or environment file is needed for poster lookup. The app asks the public Russian Wikipedia API for matching article thumbnails and continues to work if the API is unavailable or no suitable image exists.

Run tests:

```bash
npm test -- --watchAll=false
```

Create a production build:

```bash
npm run build
```

## Data

The catalogue and search use the `films` list in `src/api/shows.ts` (IDs 1000001–1000008), with editorial descriptions. Poster thumbnails are discovered via the public Russian Wikipedia API; availability and image quality depend on the matching article. Wikipedia article content and images are subject to their respective licenses. `getShow(id)` also supports fetching a TVmaze show by ID. This project is a discovery catalogue and does not stream films.

## Author

**Alexander Kolomiets** — Junior Frontend Developer (React / TypeScript)

- GitHub: https://github.com/Kolomiets94
- Email: Kolomiets94@yandex.ru
- Telegram: @Kolomiets94
