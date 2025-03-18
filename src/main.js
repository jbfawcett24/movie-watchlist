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

let playlists = [
        {
            "name": "playlist 1",
            "movieId": [11, 330459]
        }
    ];
function init()
{
    playlists = JSON.parse(localStorage.getItem("playlists"));
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
    return `<a href="movie.html" class="movieContainer" id="${movie.title.replaceAll(" ", "-")}">
        <img src="${imageBaseUrl + movie.poster_path}" alt="${movie.title} Poster">
            <h3>${movie.title}</h3>
    </a>`
}
async function setMovies(e)
{
    const movieSection = document.querySelector("#movies");
    const id = e.target.id;
    const selectedPlaylist = playlists.find(playlist => playlist.name === id.replaceAll("-", " "));
    const moviePromises = selectedPlaylist.movieId.map(movie => fetch(url + movie, options).then(res => res.json()));
    const movies = await Promise.all(moviePromises);
    const html = movies.map(movieTemplate);
    movieSection.innerHTML = html.join("");
}
function setPage(){
    const sideMenu = document.querySelector('#sideMenu > ul');
    playlists.forEach(playlist => {
        sideMenu.insertAdjacentHTML('afterbegin', sideTemplate(playlist.name));
        document.querySelector(`#${playlist.name.replaceAll(" ", "-")}`).addEventListener("click", setMovies);
    });
}

init();
