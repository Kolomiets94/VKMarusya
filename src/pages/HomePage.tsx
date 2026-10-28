import React, { useEffect, useState } from 'react';
import { getShows, searchShows, Show } from '../api/shows';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleFavorite } from '../store/favoritesSlice';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const favorites = useSelector((state: RootState) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const result = query.trim()
          ? await searchShows(query.trim())
          : await getShows();

        if (!cancelled) setShows(result);
      } catch {
        if (!cancelled) setError('Could not load shows. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, query ? 400 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, retryCount]);

  const visibleShows = shows.filter(
    (show) => !favoritesOnly || favorites.includes(show.id),
  );

  return (
    <main>
      <section className="hero">
        <h1>Российские фильмы</h1>
        <p>Выбирай фильм, ищи по названию и сохраняй в избранное.</p>
        <div className="controls">
          <input
            aria-label="Поиск фильмов"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти фильм..."
          />
          <button
            className={favoritesOnly ? 'primary' : ''}
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((value) => !value)}
          >
            {favoritesOnly ? 'Все фильмы' : 'Избранное'}
          </button>
        </div>
      </section>

      <section>
        <div className="sectionTitle">
          <h2>{query ? 'Результаты поиска' : 'Российское кино'}</h2>
          <span>{visibleShows.length} фильмов</span>
        </div>

        {loading && <p role="status">Loading…</p>}

        {error && (
          <div role="alert">
            <p>{error}</p>
            <button onClick={() => setRetryCount((count) => count + 1)}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && visibleShows.length === 0 && (
          <p>
            {favoritesOnly
              ? 'No favorite shows yet. Add some with the heart button.'
              : query
                ? 'No shows found. Try another search.'
                : 'No shows available.'}
          </p>
        )}

        <div className="grid">
          {!loading &&
            !error &&
            visibleShows.map((show) => (
              <article className="card" key={show.id}>
                <Link
                  className="poster"
                  to={`/movie/${show.id}`}
                  aria-label={`Details for ${show.name}`}
                >
                  {show.image && (
                    <img
                      className="posterImage"
                      src={show.image.medium}
                      alt={`Постер: ${show.name}`}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                        event.currentTarget.parentElement?.classList.add('posterFallback');
                      }}
                    />
                  )}
                  <strong aria-hidden="true">{show.name[0]}</strong>
                  <span>{show.rating.average ?? '—'}</span>
                </Link>
                <div className="cardBody">
                  <div>
                    <h3>
                      <Link to={`/movie/${show.id}`}>{show.name}</Link>
                    </h3>
                    <p>
                      {show.premiered?.slice(0, 4) || '—'} · {show.genres[0] || 'Show'}
                    </p>
                  </div>
                  <button
                    aria-label={favorites.includes(show.id) ? `Remove ${show.name} from favorites` : `Add ${show.name} to favorites`}
                    aria-pressed={favorites.includes(show.id)}
                    onClick={() => dispatch(toggleFavorite(show.id))}
                  >
                    {favorites.includes(show.id) ? '♥' : '♡'}
                  </button>
                </div>
              </article>
            ))}
        </div>
      </section>

      <p className="source">
        Подборка российских фильмов · Описания редакционные · Просмотр фильмов на сайте не предоставляется.
      </p>
    </main>
  );
};
