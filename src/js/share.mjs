let playlists = [];

if(localStorage.getItem("playlists")) {
    playlists = JSON.parse(localStorage.getItem("playlists"));
}
const params = new URLSearchParams(window.location.search);
let idString = params.get("movieID");
console.log(idString);
playlists.push({
    "name": `${params.get("name")}`,
    "movieId": idString.split(",")
});
localStorage.setItem("playlists", JSON.stringify(playlists));
window.location.href = "index.html";
