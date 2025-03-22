// TODO - credit justwatch for streaming info
import {getMovieInfo, getWatchData, imageBaseUrl} from "./api.mjs";
import {watchTemplate} from "./templates.mjs"

let movieID = 11;

function getMovieID()
{
    const params = new URLSearchParams(window.location.search);
    if(params.get('movieID') == null)
    {
        movieID = 11;
    } else {
        movieID = params.get("movieID");
    }
}
async function setMovieInfo()
{
    const movie = await getMovieInfo(movieID);
    console.log(movie);
    const banner = document.querySelector("#movieBanner");
    const title = document.querySelector("#movieTitle");
    const description = document.querySelector("#movieDescription");
    banner.src = imageBaseUrl + "/" +movie.backdrop_path;
    title.innerText = movie.title + " (" + movie.release_date.split("-")[0] + ")";
    description.innerText = movie.overview;
}
async function setWatchInfo()
{
    const watchData = await getWatchData(movieID);
    console.log(watchData);
    document.querySelector("#buy").innerHTML = watchData.buy.map(watchTemplate);
    document.querySelector("#rent").innerHTML = watchData.rent.map(watchTemplate);
    document.querySelector("#flatRate").innerHTML = watchData.flatrate.map(watchTemplate);
}
function init()
{
    getMovieID();
    setMovieInfo();
    setWatchInfo();
}

init();