const auth = import.meta.env.VITE_TMDB_AUTH_Key;
const url = 'https://api.themoviedb.org/3/movie/597';
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: auth
    }
}

fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));