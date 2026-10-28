const ALLOWED_ORIGINS = new Set([
  'https://kolomiets94.github.io',
  'http://localhost:3000',
]);

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return Response.json({ error: 'Origin not allowed' }, { status: 403 });
    }

    if (request.method !== 'GET' || url.pathname !== '/search/movie') {
      return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders(origin) });
    }

    if (!env.TMDB_API_KEY) {
      return Response.json({ error: 'TMDB proxy is not configured' }, { status: 503, headers: corsHeaders(origin) });
    }

    const query = (url.searchParams.get('query') || '').trim().slice(0, 100);
    const year = url.searchParams.get('year') || '';
    if (!query || (year && !/^\\d{4}$/.test(year))) {
      return Response.json({ error: 'Invalid query or year' }, { status: 400, headers: corsHeaders(origin) });
    }

    const tmdbUrl = new URL('https://api.themoviedb.org/3/search/movie');
    tmdbUrl.searchParams.set('api_key', env.TMDB_API_KEY);
    tmdbUrl.searchParams.set('query', query);
    tmdbUrl.searchParams.set('language', 'ru-RU');
    tmdbUrl.searchParams.set('include_adult', 'false');
    if (year) tmdbUrl.searchParams.set('year', year);

    try {
      const upstream = await fetch(tmdbUrl.toString(), {
        headers: { Accept: 'application/json' },
        cf: { cacheTtl: 3600, cacheEverything: true },
      });
      if (!upstream.ok) {
        return Response.json({ error: 'TMDB request failed' }, { status: 502, headers: corsHeaders(origin) });
      }

      const payload = await upstream.json();
      const results = (payload.results || []).slice(0, 10).map((movie) => ({
        title: movie.title,
        release_date: movie.release_date || '',
        poster_path: movie.poster_path || null,
      }));
      return Response.json({ results }, {
        headers: { ...corsHeaders(origin), 'Cache-Control': 'public, max-age=3600' },
      });
    } catch {
      return Response.json({ error: 'TMDB unavailable' }, { status: 502, headers: corsHeaders(origin) });
    }
  },
};
