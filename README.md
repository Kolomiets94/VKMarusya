# VK Marusya — Movie Discovery SPA

**Live demo:** https://kolomiets94.github.io/VKMarusya/

A responsive React + TypeScript portfolio application for browsing a local editorial selection of eight Russian films, viewing details and saving favorites. Detail pages for IDs outside the local selection request data from TVmaze.

## Features

- Local catalogue of eight Russian films
- Debounced search (400 ms)
- Show details with poster, genres, year, rating and description
- Client-side routing with a dedicated details URL
- Favorites managed with Redux Toolkit
- Favorites persisted in localStorage
- Loading and API error states
- Responsive desktop/mobile layout
- 404 route

## Tech stack

React 19 · TypeScript · Redux Toolkit · React Redux · React Router · Axios · CSS

## Routes

- `/` — catalogue and search
- `/movie/:id` — show details

## Run locally

```bash
npm ci
npm start
```

For a production build:

```bash
npm run build
```

## Data source

The catalogue and search use the `russianFilms` array in `src/api/shows.ts` (IDs 1000001–1000008), with editorial descriptions. `getShow(id)` returns local films for these IDs and otherwise requests `https://api.tvmaze.com/shows/{id}`. The catalogue does not fetch live TVmaze data. External show data and artwork come from [TVmaze](https://www.tvmaze.com).

## Author

**Alexander Kolomiets** — Junior Frontend Developer (React / TypeScript)

- GitHub: https://github.com/Kolomiets94
- Email: Kolomiets94@yandex.ru
- Telegram: @Kolomiets94
