import LZString from "lz-string";

let playlists = [];

if(localStorage.getItem("playlists")) {
    playlists = JSON.parse(localStorage.getItem("playlists"));
}
const params = new URLSearchParams(window.location.search);
let compressedString = params.get("movieID");
let idString = LZString.decompressFromEncodedURIComponent(compressedString);
console.log(idString);
if(!playlists.some(playlist => playlist.name === params.get("name")))
{
    playlists.push({
        "name": `${params.get("name")}`,
        "movieId": idString.split(",")
    });
    localStorage.setItem("playlists", JSON.stringify(playlists));
}
window.location.href = "index.html";
