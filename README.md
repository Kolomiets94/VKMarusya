# VK Marusya — Movie Discovery SPA

A responsive React + TypeScript portfolio application for discovering TV shows, viewing details and saving favorites. The catalogue uses live data from the TVmaze API.

## Features

- Live catalogue from TVmaze
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

## Architecture

```text
src/
├── api/          # TVmaze API client and types
├── components/   # Reusable UI components
├── data/         # Local demo data kept for reference
├── pages/        # Catalogue and details pages
├── store/        # Redux store and favorites slice
├── types/        # Shared TypeScript models
├── App.tsx       # Layout and routing
└── index.tsx     # Providers and application entry point
```

## Routes

- `/` — catalogue and search
- `/movie/:id` — show details

## Run locally

```bash
npm install
npm start
```

Create React App starts the development server at `http://localhost:3000`.

For a production build:

```bash
npm run build
```

## Data source

Show information and artwork are provided by [TVmaze](https://www.tvmaze.com). TVmaze API data is licensed under CC BY-SA.

## Project status

This is a portfolio project. Favorites are intentionally stored on the client in localStorage; no user account or custom backend is required.

## Author

**Alexander Kolomiets** — Junior Frontend Developer (React / TypeScript)

- GitHub: https://github.com/Kolomiets94
- Email: Kolomiets94@yandex.ru
- Telegram: @Kolomiets94
