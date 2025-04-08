import {imageBaseUrl} from "./api.mjs"
import noPoster from "../images/no-poster.png";
export function movieTemplate(movie)
{
    return `<section class="movieContainer" id="${movie.id}">
                <img src="${movie.poster_path ? `${imageBaseUrl}/${movie.poster_path}` : noPoster}" alt="${movie.title} Poster">
                <h3>${movie.title}</h3>
                <svg fill="#000000" height="60px" width="30px" viewBox="0 0 25.283 25.283" xml:space="preserve" class="movieMenu">
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

export function sideTemplate(name)
{
    return `<li>
        <span id="${name.replaceAll(" ", "-")}">${name}
            <svg fill="#000000" height="60px" width="30px" viewBox="0 0 25.283 25.283" xml:space="preserve" class="deletePlaylist">
                <g>
                    <path d="M4.153,4.757v20.526h17V4.757H4.153z M8.569,22.386H5.775V7.82H8.57L8.569,22.386L8.569,22.386z M13.886,22.386h-2.797
                        V7.82h2.797C13.886,7.82,13.886,22.386,13.886,22.386z M19.202,22.386h-2.795V7.82h2.795V22.386z"/>
                    <path d="M19.931,3.704L21.13,3.7l-0.002-2.4l-5.463-0.006l-0.01-0.657c-1.643-0.875-4.76-0.82-6.014-0.014v0.702H4.13l0.004,2.402
                        h1.199L19.931,3.704z"/>
                </g>
            </svg>
                </span>
   </li>`
}

export function watchTemplate(info)
{
    return `<li>
        <p>${info.provider_name}</p>
        <img src="${imageBaseUrl}/${info.logo_path}" alt="${info.provider_name} Logo">
    </li>`
}

export function searchResultTemplate(movie)
{
    return `<section class="movie" id="${movie.id}">
            <img src="${movie.poster_path ? `${imageBaseUrl}/${movie.poster_path}` : noPoster}" alt="${movie.title}">
            <div>
            <h3 class="title">${movie.title}</h3>
            <h4 class="addMovie">+</h4>
            </div>
            <p class="description">${movie.overview ? movie.overview : "No overview available."}</p>
        </section>`
}