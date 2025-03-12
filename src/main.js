const apiKey = "9178fea20a9c4cc8bce69c3054299fbb";
const url = 'https://api.themoviedb.org/3/movie/597';
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTc4ZmVhMjBhOWM0Y2M4YmNlNjljMzA1NDI5OWZiYiIsIm5iZiI6MTc0MTE5MzUwOS42NjQsInN1YiI6IjY3Yzg4MTI1MGM2NWVlOWFiYWU3MThjNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xmOh5H5tMxcBQTVcBiuUoSf5tnYWpOxVXtfAJCeFmrI'
    }
}

fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));