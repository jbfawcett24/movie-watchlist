import { movieTemplate, sideTemplate } from './templates.mjs';
import { url, options } from "./api.mjs"
let selectedPlaylist;


export function init() {
    // uncomment the below line to set an initial playlist
    //localStorage.setItem("playlists", JSON.stringify(playlists));
    playlists = getPlaylists();
    document.querySelector("#add").addEventListener("click", createPlaylist);
    setPage();
}
export function getPlaylists()
{
    return localStorage.getItem("playlists") ? JSON.parse(localStorage.getItem("playlists")) : [];
}
async function setMovies(e) {
    const movieSection = document.querySelector("#movies");
    movieSection.innerHTML = "Loading...";
    const id = e.target.id;
    selectedPlaylist = playlists.find(playlist => playlist.name === id.replaceAll("-", " "));
    console.log(selectedPlaylist);
    const moviePromises = selectedPlaylist.movieId.map(movie => fetch(url + movie, options).then(res => res.json()));
    const movies = await Promise.all(moviePromises);
    console.log(movies);
    const html = movies.map(movieTemplate);
    document.querySelector("#name").innerText = selectedPlaylist.name;
    movieSection.innerHTML = html.join("");
    document.querySelectorAll(".movieMenu").forEach(button => button.addEventListener("click", event => {
        const menu = event.target.closest(".movieContainer");
        const deleteButton = menu.querySelector(".delete");
        deleteButton.classList.remove("hide");
        document.addEventListener("click", hideDelete);
        function hideDelete(e) {
            if (!deleteButton.contains(e.target) && e.target !== event.target) {
                deleteButton.classList.add("hide");
                document.removeEventListener("click", hideDelete);
            }
        }
        deleteButton.addEventListener("click", deleteMovie);
    }));
    document.querySelectorAll(".movieContainer").forEach(button => button.addEventListener("click", setURL))
}
function setURL(e) {
    if (e.target.closest(".movieMenu") || e.target.closest(".delete")) {
        return;
    }

    const movie = e.target.closest(".movieContainer");
    if (!movie) return; // Prevent errors

    const id = movie.id;
    let params = new URLSearchParams();
    params.append("movieID", id);
    window.location.href = "movie.html?" + params;
}
function setPage() {
    const sideMenu = document.querySelector('#sideMenu > ul');
    sideMenu.innerHTML = `<li><span id="add">+ Add New Playlist</span></li>`;
    playlists.forEach(playlist => {
        sideMenu.insertAdjacentHTML('afterbegin', sideTemplate(playlist.name));
        document.querySelector(`#${playlist.name.replaceAll(" ", "-")}`).addEventListener("click", setMovies);
    });
    document.querySelector("#add").addEventListener("click", createPlaylist);
}
function deleteMovie(e) {
    const movie = e.target.closest('.movieContainer');
    const movieList = document.querySelector("#movies");
    movieList.removeChild(movie);
    console.log(movie.id);
    console.log(selectedPlaylist.movieId[0]);
    const index = selectedPlaylist.movieId.findIndex(id => id === parseInt(movie.id));
    console.log(index);
    selectedPlaylist.movieId.splice(index, 1);
    updatePlaylists();
}
function updatePlaylists() {
    const index = playlists.findIndex(playlist => playlist.name === selectedPlaylist.name);
    playlists[index] = selectedPlaylist;
    localStorage.setItem("playlists", JSON.stringify(playlists));
}

function createPlaylist() {
    console.log("clicked");
    document.querySelector("#newList").classList.remove("hide");
    const form = document.querySelector("#newListForm");
    form.addEventListener("submit", event => {
        event.preventDefault();
        playlists.push({
            "name": `${form.querySelector("#newListName").value}`,
            "movieId": []
        });
        setPage();
        document.querySelector("#newList").classList.add("hide");
        console.log(playlists);
        localStorage.setItem("playlists", JSON.stringify(playlists));
    })
}

document.querySelector(".random").addEventListener("click",spinner);
function spinner(){
    let params = new URLSearchParams();
    console.log(selectedPlaylist);
    if(selectedPlaylist)
    {
        console.log("true");
        params.append("playlist", playlists.findIndex(playlist => playlist === selectedPlaylist).toString());
        window.location.href = "spinner.html?" + params;
    }
}

function share()
{
    const params = new URLSearchParams();
    params.append("name", selectedPlaylist.name);
    params.append("movieID", selectedPlaylist.movieId.join(","));
    console.log(window.location);
    const shareUrl = window.location + "share.html?" + params;
    document.querySelector("#share").innerText = shareUrl;
    document.querySelector("#share").classList.remove("hide");
    console.log(shareUrl);
}

document.querySelector(".share").addEventListener("click", share);
init();

