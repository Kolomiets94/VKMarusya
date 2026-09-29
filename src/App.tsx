import React, { useMemo, useState } from 'react';
import './App.css';

type Movie = { id:number; title:string; year:number; genre:string; rating:number; description:string };

const movies: Movie[] = [
 {id:1,title:'The Shawshank Redemption',year:1994,genre:'Drama',rating:9.3,description:'Two imprisoned men form a lasting friendship over many years.'},
 {id:2,title:'The Dark Knight',year:2008,genre:'Action',rating:9.0,description:'A masked hero faces a criminal mastermind who throws Gotham into chaos.'},
 {id:3,title:'Interstellar',year:2014,genre:'Sci-Fi',rating:8.7,description:'Explorers travel through a wormhole in search of a future for humanity.'},
 {id:4,title:'Spirited Away',year:2001,genre:'Animation',rating:8.6,description:'A young girl enters a mysterious world ruled by spirits.'},
 {id:5,title:'Parasite',year:2019,genre:'Thriller',rating:8.5,description:'Two families become connected in unexpected and increasingly dangerous ways.'},
 {id:6,title:'Whiplash',year:2014,genre:'Drama',rating:8.5,description:'A young drummer is pushed to his limits by an uncompromising instructor.'}
];

const App: React.FC = () => {
 const [query,setQuery]=useState('');
 const [genre,setGenre]=useState('All');
 const [favorites,setFavorites]=useState<number[]>(()=>JSON.parse(localStorage.getItem('movie-favorites')||'[]'));
 const [selected,setSelected]=useState<Movie|null>(null);
 const genres=['All',...Array.from(new Set(movies.map(m=>m.genre)))];
 const visible=useMemo(()=>movies.filter(m=>(genre==='All'||m.genre===genre)&&m.title.toLowerCase().includes(query.toLowerCase())),[query,genre]);
 const toggle=(id:number)=>setFavorites(prev=>{const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];localStorage.setItem('movie-favorites',JSON.stringify(next));return next;});
 return <div className="app">
  <header><div><span className="brand">VK Marusya</span><p>Movie discovery portfolio project</p></div><span className="counter">♥ {favorites.length}</span></header>
  <main>
   <section className="hero"><h1>Find a movie for tonight</h1><p>Search the catalogue, filter by genre and save films to your favorites.</p>
    <div className="controls"><input aria-label="Search movies" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search movies..." />
    <select aria-label="Filter by genre" value={genre} onChange={e=>setGenre(e.target.value)}>{genres.map(g=><option key={g}>{g}</option>)}</select></div>
   </section>
   <section><div className="sectionTitle"><h2>Movies</h2><span>{visible.length} results</span></div>
    <div className="grid">{visible.map(movie=><article className="card" key={movie.id} onClick={()=>setSelected(movie)}>
      <div className="poster"><span>{movie.rating}</span><strong>{movie.title.slice(0,1)}</strong></div>
      <div className="cardBody"><div><h3>{movie.title}</h3><p>{movie.year} · {movie.genre}</p></div>
      <button aria-label="Toggle favorite" onClick={e=>{e.stopPropagation();toggle(movie.id)}}>{favorites.includes(movie.id)?'♥':'♡'}</button></div>
    </article>)}</div>
   </section>
  </main>
  {selected&&<div className="modal" onClick={()=>setSelected(null)}><div className="modalCard" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><span className="pill">{selected.genre}</span><h2>{selected.title}</h2><p>{selected.year} · IMDb {selected.rating}</p><p>{selected.description}</p><button className="primary" onClick={()=>toggle(selected.id)}>{favorites.includes(selected.id)?'Remove from favorites':'Add to favorites'}</button></div></div>}
 </div>;
};
export default App;
