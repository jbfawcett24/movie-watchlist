import {options, searchUrl} from "./api.mjs"
import {searchResultTemplate} from "./templates.mjs";

let movies;
let totalPages = 1;
let currentPage = 1;
let playlists = [];
async function init()
{
    playlists = JSON.parse(localStorage.getItem("playlists"));
    currentPage = parseInt(getParams("page"));
    await findMovies();
    displayMovies();
    setPageNums();
    setPlaylistSelector();
}

async function findMovies()
{
    const name = getParams("searchQuery");
    const searchURL = searchUrl +"?query=" + name + "&page=" + currentPage
    console.log(searchURL);
    let response = await fetch(searchURL, options);
    movies = await response.json();
    console.log(movies);
    document.querySelector("#numResults").innerHTML = movies.total_results + `${movies.total_results === 1 ? " Result Found" : " Results Found"}`;
    totalPages = movies.total_pages;
    movies = movies.results;
}

function getParams(param) {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    if(params.get(param)) {
        return params.get(param);
    } else {
        return 1;
    }
    
}
function displayMovies()
{
    const results = document.querySelector(".results");
    const html = movies.map((movie) => searchResultTemplate(movie));
    results.innerHTML = html.join("");
    document.querySelectorAll(".addMovie").forEach((add) => add.addEventListener("click", addToPlaylist));
}
function addToPlaylist(e) {
    const movieId = e.target.closest("section").id;
    const playlistSelector = document.querySelector("#playlistSelector");
    movePlaylistSelector(e, playlistSelector);
    playlistSelector.style.display = "block";
    playlistSelector.style.maxHeight = "200px";
    console.log(movieId);
    playlistSelector.querySelectorAll("li").forEach((li) => {li.addEventListener("click", (event) => {
        let selectedPlaylist = playlists.findIndex(playlist => playlist.name === event.target.id);
        console.log(playlists[selectedPlaylist].movieId.includes(movieId));
        if(!playlists[selectedPlaylist].movieId.includes(movieId))
        {
            playlists[selectedPlaylist].movieId.push(movieId);
            localStorage.setItem("playlists", JSON.stringify(playlists));
            console.log(selectedPlaylist);
        }
    })})
    setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
    }, 10);
}
function movePlaylistSelector(e, playlistSelector) {
    const rect = e.target.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const absoluteLeft = rect.left + window.scrollX;
    playlistSelector.style.top= `${absoluteTop}px`;
    playlistSelector.style.left = `${absoluteLeft - 100}px`
    console.log(absoluteTop + " " + absoluteLeft);
}
function handleOutsideClick(e) {
    const playlistSelector = document.querySelector("#playlistSelector");
    console.log("clicked" + e.target);
    if (!playlistSelector.contains(e.target)) {
        console.log("remove");
        playlistSelector.style.maxHeight = "0px";
        playlistSelector.style.display = "none";
        document.removeEventListener("click", handleOutsideClick); // Remove listener to avoid unnecessary checks
    }
}
function setPlaylistSelector() {
    const playlistSelector = document.querySelector("#playlistSelector");
    const html = playlists.map(playlist => `<li id="${playlist.name}">${playlist.name}</li>`);
    playlistSelector.innerHTML = html.join("");
}

function setPageNums() {
    const pages = document.querySelector(".pageSelector");
    const urlParams = new URLSearchParams(window.location.search);
    if(currentPage > 1) {
        urlParams.set("page", currentPage - 1);
        pages.insertAdjacentHTML("beforeend", `<a href="search.html?${urlParams.toString()}"><<</a>`);
    }
    for(let i = 1; i<totalPages+1; i++)
    {
        urlParams.set("page", i);
        pages.insertAdjacentHTML("beforeend", `<a href="search.html?${urlParams.toString()}">${i}</a>`)
    }
    if(currentPage < totalPages)
    {
        urlParams.set("page", currentPage + 1);
        pages.insertAdjacentHTML("beforeend", `<a href="search.html?${urlParams.toString()}">>></a>`);
    }
}
init();