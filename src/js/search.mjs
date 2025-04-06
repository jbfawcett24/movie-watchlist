import { options, searchUrl } from "./api.mjs"
import { searchResultTemplate } from "./templates.mjs";

let movies;
let totalPages = 1;
let currentPage = 1;
let playlists = [];
async function init() {
    playlists = JSON.parse(localStorage.getItem("playlists"));
    currentPage = parseInt(getParams("page"));
    await findMovies();
    displayMovies();
    setPageNums();
}

async function findMovies() {
    const name = getParams("searchQuery");
    const searchURL = searchUrl + "?query=" + name + "&page=" + currentPage
    console.log(searchURL);
    let response = await fetch(searchURL, options);
    movies = await response.json();
    console.log(movies);
    totalPages = movies.total_pages;
    movies = movies.results;
}

function getParams(param) {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    if (params.get(param)) {
        return params.get(param);
    } else {
        return 1;
    }

}
function displayMovies() {
    const results = document.querySelector(".results");
    const html = movies.map((movie) => searchResultTemplate(movie));
    results.innerHTML = html.join("");
    document.querySelectorAll(".addMovie").forEach((add) => add.addEventListener("click", addToPlaylist));
}
function addToPlaylist(e) {
    const movieId = e.target.closest("section").id;
    setPlaylistSelector(movieId);
}

function setPlaylistSelector(movieId) {
    const playlistSelector = document.querySelector("#playlistSelector");
    const optionsDiv = document.querySelector("#playlistOptions");

    // Build radio buttons for each playlist
    const html = playlists.map((playlist, index) => `
        <div>
            <input type="radio" name="playlist" id="playlist${index}" value="${playlist.name}" ${index === 0 ? 'checked' : ''}>
            <label for="playlist${index}">${playlist.name}</label>
        </div>
    `).join("");
    optionsDiv.innerHTML = html;

    // Show modal
    playlistSelector.classList.remove("hide");
    const form = document.querySelector("#addMovieForm");
    form.onsubmit = (e) => {
        e.preventDefault();
        const selected = form.playlist.value;
        const index = playlists.findIndex(p => p.name === selected);

        if (!playlists[index].movieId.includes(movieId)) {
            playlists[index].movieId.push(movieId);
            localStorage.setItem("playlists", JSON.stringify(playlists));
        }

        playlistSelector.classList.add("hide");
    };

    // Cancel button
    document.querySelector("#cancelAddButton").onclick = () => {
        playlistSelector.classList.add("hide");
    };

    // Close (X)
    document.querySelector("#playlistSelector.close").onclick = () => {
        playlistSelector.classList.add("hide");
    };
}

function setPageNums() {
    const pages = document.querySelector(".pageSelector");
    const urlParams = new URLSearchParams(window.location.search);
    if (currentPage > 1) {
        urlParams.set("page", currentPage - 1);
        pages.insertAdjacentHTML("beforeend", `<a href="search.html?${urlParams.toString()}"><<</a>`);
    }
    for (let i = 1; i < totalPages + 1; i++) {
        urlParams.set("page", i);
        pages.insertAdjacentHTML("beforeend", `<a href="search.html?${urlParams.toString()}">${i}</a>`)
    }
    if (currentPage < totalPages) {
        urlParams.set("page", currentPage + 1);
        pages.insertAdjacentHTML("beforeend", `<a href="search.html?${urlParams.toString()}">>></a>`);
    }
}
init();