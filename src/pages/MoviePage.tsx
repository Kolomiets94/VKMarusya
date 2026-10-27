import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getShow, Show } from '../api/shows';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleFavorite } from '../store/favoritesSlice';

export const MoviePage = () => {
  const { id } = useParams();
  const showId = Number(id);
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const favorites = useSelector((state: RootState) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;
    setShow(null);
    setError('');
    setLoading(true);

    if (!Number.isInteger(showId) || showId <= 0) {
      setError('Invalid show link');
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    getShow(showId)
      .then((result) => {
        if (!cancelled) setShow(result);
      })
      .catch(() => {
        if (!cancelled) setError('Show not found or temporarily unavailable');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showId]);

  if (loading) return <main><p>Loading…</p></main>;

  if (error) {
    return (
      <main>
        <h1>{error}</h1>
        <Link to="/">← Back home</Link>
      </main>
    );
  }

  if (!show) {
    return (
      <main>
        <h1>Show not found or temporarily unavailable</h1>
        <Link to="/">← Back home</Link>
      </main>
    );
  }

  const summary = show.summary?.replace(/<[^>]*>/g, '') || 'No description available.';

  return (
    <main>
      <Link to="/">← К каталогу</Link>
      <section className="detail">
        {show.image && (
          <img className="detailPoster" src={show.image.medium} alt={show.name} />
        )}
        <div>
          <span className="pill">{show.genres.join(' · ') || 'Show'}</span>
          <h1>{show.name}</h1>
          <p>{show.premiered?.slice(0, 4) || '—'} · Рейтинг {show.rating.average ?? '—'}</p>
          <p>{summary}</p>
          <button
            className="primary"
            onClick={() => dispatch(toggleFavorite(show.id))}
          >
            {favorites.includes(show.id) ? 'Убрать из избранного' : 'В избранное'}
          </button>
        </div>
      </section>
      <p className="source">
        Подборка российских фильмов · Описания редакционные · Просмотр фильмов на сайте не предоставляется.
      </p>
    </main>
  );
};
