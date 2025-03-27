export const auth = import.meta.env.VITE_TMDB_AUTH_Key;
export const url = 'https://api.themoviedb.org/3/movie/';
export const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
export const watchURL ="/watch/providers"
export const searchUrl = "https://api.themoviedb.org/3/search/movie";
export const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: auth
    }
}

export async function getMovieInfo(id)
{
    const response = await fetch(url + id, options).then(res => res.json());
    return response
}

export async function getWatchData(id)
{
    const response = await fetch(url + id + watchURL, options);
    if(response.ok)
    {
        const watch = await response.json();
        return watch.results.US;
    } else {
        return "";
    }
}