import axios from 'axios';
export interface Show { id:number; name:string; premiered:string|null; genres:string[]; rating:{average:number|null}; summary:string|null; image:{medium:string;original:string}|null }
const client=axios.create({baseURL:'https://api.tvmaze.com'});
export const searchShows=async(query:string):Promise<Show[]>=>{const {data}=await client.get('/search/shows',{params:{q:query}});return data.map((item:{show:Show})=>item.show)};
export const getShows=async():Promise<Show[]>=>{const {data}=await client.get('/shows',{params:{page:0}});return data.slice(0,24)};
export const getShow=async(id:number):Promise<Show>=>{const {data}=await client.get(`/shows/${id}`);return data};
