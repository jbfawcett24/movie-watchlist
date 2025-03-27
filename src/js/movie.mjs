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
    banner.src = movie.backdrop_path ? imageBaseUrl + "/" + movie.backdrop_path : "../images/no-banner.png";
    title.innerText = movie.title + " (" + movie.release_date.split("-")[0] + ")";
    description.innerText = movie.overview ? movie.overview : "No overview found.";
}
async function setWatchInfo()
{
    const watchData = await getWatchData(movieID);
    console.log(watchData);
    if(watchData)
    {
        document.querySelector("#buy").innerHTML = watchData.buy ? watchData.buy.map(watchTemplate) : "No source found.";
        document.querySelector("#rent").innerHTML = watchData.rent ? watchData.rent.map(watchTemplate) : "No source found.";
        document.querySelector("#flatRate").innerHTML = watchData.flatrate ? watchData.flatrate.map(watchTemplate) : "No source found.";
    } else { 
        document.querySelector("#watch").innerHTML = `<h2>Where to watch</h2> No source found.`;
    }
}
function init()
{
    getMovieID();
    setMovieInfo();
    setWatchInfo();
}

init();