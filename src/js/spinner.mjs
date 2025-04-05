import {url, options, imageBaseUrl} from "./api.mjs"

const spinner = document.querySelector('#spinner');
//console.log(spinner.style.height);
const middle = [spinner.offsetTop + (spinner.offsetHeight/2),spinner.offsetLeft + (spinner.offsetHeight/2)];
//console.log(middle[0], middle[1]);
let numPictures = 15;
let theta = 0;
let thetaOffset = 2*Math.PI;
let time = 0;
let images = [{}];
let mouseDown = false;

function createPictures()
{
    //console.log(thetaOffset);
    for(let i = 0; i < numPictures; i++) {
        spinner.insertAdjacentHTML("beforeend", `<div class="picture" id="${i}"><img src="${images[i].image}" alt="movie poster"></div>`);
    }
    setPicturePosition();
}

function setPicturePosition()
{
    document.querySelectorAll(".picture").forEach((element) => {
        const radius = 200;
        const picNum = parseInt(element.id);
        //console.log(Math.cos(thetaOffset*picNum));
        //console.log(middle[0]);
        element.style.top = (-element.offsetHeight/2 + middle[0] + (Math.cos(theta + (thetaOffset * picNum))*radius)).toString() + "px";
        element.style.left = (-element.offsetWidth/2 +middle[1] - (Math.sin(theta + (thetaOffset * picNum))*radius)).toString() + "px";
        //console.log(element.style.top);
        //console.log(element.style.left);
    });
}

function selectWinner()
{
    console.log("selecting winner");
    let winningId = 0;
    document.querySelectorAll(".picture").forEach((element) => {
        console.log(`comparing ${element.id} at ${element.style.top} to ${winningId} at ${document.getElementById(winningId).style.top}`);
        if(parseInt(element.style.top) >  parseInt(document.getElementById(winningId).style.top))
        {
            winningId = element.id;
        }   
    });
    const winner = document.getElementById(winningId);
    winner.style.height = (window.innerHeight*0.75).toString() + "px";
    winner.style.top = "15%";
    //console.log(winner.offsetWidth);
    winner.style.left = (window.innerWidth/2 - ((window.innerHeight*0.75)*(2/6)))+ "px";
    winner.style.zIndex = "1000";
    document.querySelector(".playlistName").innerText = images[winningId].title;
    //console.log(winningId);
    
}
function movePictures() {
    return new Promise((resolve) => {
        function step() {
            if (time > 0) {
                theta += time/5;
                setPicturePosition();
                time -= 0.2;
                setTimeout(step, 200);
            } else {
                resolve(); // Resolve when animation is done
            }
        }
        step();
    });
}
async function getImage(id)
{
    const response = await fetch(url + id, options)
    if(response.ok)
    {
        const data = await response.json();
        return {
            title: data.title,
            image: data.poster_path ? `${imageBaseUrl}/${data.poster_path}` : "../images/no-poster.png"
        };
    }
}
function powerUp()
{
    document.querySelector("#powerbutton").removeEventListener("mousedown", powerUp);
    document.querySelector("#powerbutton").addEventListener("mouseup", spin);
    if(time<10 && mouseDown)
    {
        time+=0.5;
        //console.log(time);
        document.querySelector("#full").style.height = (time*10) + "%";
        setTimeout(powerUp, 100);
    }
}
async function spin()
{
    mouseDown = false
    await movePictures();
    selectWinner();
}
async function init()
{
    const params = new URLSearchParams(window.location.search);
    const selected = params.get("playlist");
    const playlists = JSON.parse(localStorage.getItem("playlists"));
    const selectedPlaylist = playlists[selected];
    //console.log(selectedPlaylist);
    images = await Promise.all(selectedPlaylist.movieId.map(id => getImage(id)));
    numPictures = images.length;
    thetaOffset = (2*Math.PI) / numPictures;
    createPictures();
    document.querySelector("#powerbutton").addEventListener("mousedown", function() {
        mouseDown = true;
        powerUp();
        });
}
init();
