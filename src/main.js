const auth = import.meta.env.VITE_TMDB_AUTH_Key;
const url = 'https://api.themoviedb.org/3/movie/';
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: auth
    }
}
let selectedPlaylist = 0;

let playlists = [
        {
            "name": "playlist 1",
            "movieId": [11, 330459]
        }
    ];
function init()
{
    localStorage.setItem("playlists", JSON.stringify(playlists));
    playlists = JSON.parse(localStorage.getItem("playlists"));
    selectedPlaylist = playlists[0];
    setPage();
}
function sideTemplate(name)
{
    return `<li>
        <span id="${name.replaceAll(" ", "-")}">${name}</span>
   </li>`
}
function movieTemplate(movie)
{
        return `<section class="movieContainer" id="${movie.id}">
                <img src="${imageBaseUrl + movie.poster_path}" alt="${movie.title} Poster">
                <h3>${movie.title}</h3>
                <svg fill="#000000" height="30px" width="30px" viewBox="0 0 25.283 25.283" xml:space="preserve" class="movieMenu">
                    <g>
                        <path d="M4.153,4.757v20.526h17V4.757H4.153z M8.569,22.386H5.775V7.82H8.57L8.569,22.386L8.569,22.386z M13.886,22.386h-2.797
                            V7.82h2.797C13.886,7.82,13.886,22.386,13.886,22.386z M19.202,22.386h-2.795V7.82h2.795V22.386z"/>
                        <path d="M19.931,3.704L21.13,3.7l-0.002-2.4l-5.463-0.006l-0.01-0.657c-1.643-0.875-4.76-0.82-6.014-0.014v0.702H4.13l0.004,2.402
                            h1.199L19.931,3.704z"/>
                    </g>
                </svg>
                <div class="delete hide">
                    <p>Delete</p>
                </div>
            </section>`
}
async function setMovies(e)
{
    const movieSection = document.querySelector("#movies");
    const id = e.target.id;
    selectedPlaylist = playlists.find(playlist => playlist.name === id.replaceAll("-", " "));
    console.log(selectedPlaylist);
    const moviePromises = selectedPlaylist.movieId.map(movie => fetch(url + movie, options).then(res => res.json()));
    const movies = await Promise.all(moviePromises);
    const html = movies.map(movieTemplate);
    movieSection.innerHTML = html.join("");
    document.querySelectorAll(".movieMenu").forEach(button => button.addEventListener("click", event => {
        const menu = event.target.closest(".movieContainer");
        const deleteButton = menu.querySelector(".delete");
        deleteButton.classList.remove("hide");
        document.addEventListener("click", hideDelete);
        function hideDelete(e)
        {
            if (!deleteButton.contains(e.target) && e.target !== event.target) {
                deleteButton.classList.add("hide");
                document.removeEventListener("click", hideDelete);
            }
        }
        deleteButton.addEventListener("click", deleteMovie);
    }));
}
function setPage(){
    const sideMenu = document.querySelector('#sideMenu > ul');
    sideMenu.innerHTML = `<li><span id="add">+ Add New Playlist</span></li>`;
    playlists.forEach(playlist => {
        sideMenu.insertAdjacentHTML('afterbegin', sideTemplate(playlist.name));
        document.querySelector(`#${playlist.name.replaceAll(" ", "-")}`).addEventListener("click", setMovies);
    });
}
function deleteMovie(e)
{
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
        "movieId": []});
        setPage();
        document.querySelector("#newList").classList.add("hide");
        localStorage.setItem("playlists", JSON.stringify(playlists));
    })
}
init();
document.querySelector("#add").addEventListener("click", createPlaylist);
