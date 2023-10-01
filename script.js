const apiKey = "26765efb4996579a1b0371b10edde16f";
const youKey = "AIzaSyD13Hb16zTecoh06dY1MTzC9lISQHy_KUU";

const url = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youTubeApi = "https://www.googleapis.com/youtube/v3/";

const apiPaths = {
    fetchAllCategories: `${url}/genre/movie/list?api_key=${apiKey}`,
    fetchMovieList: (id) => `${url}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${url}/trending/all/day?api_key=${apiKey}&language=en-US`,
    searchOnYoutube: (query) => `${youTubeApi}search?part=snippet&q=${query}&key=${youKey}`
}



function init() {
    // fetchAndBuildMovieSection(apiPaths.fetchTrending, 'Trending Now');
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
        .then(list => {
            const randomIndex = parseInt(Math.random() * list.length);
            buildBannerSection(list[randomIndex]);
        }).catch(err => {
            console.error(err);
        });
}

function buildBannerSection(movie) {
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');
    div.innerHTML = `
<h2 class="banner__title">${movie.title}</h2>
<p class="banner__info">Release Date: ${movie.release_date}</p>
<p class="banner__overview">${movie.overview}</p>
<div class="action-buttons-cont">
    <button class="action-button"><i class="fa-solid fa-play"></i> &nbsp;&nbsp; Play</button>
    <button class="action-button"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button>

</div>`
        ;
    div.className = "banner-content containe";
    bannerCont.append(div);
}

function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
        .then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.forEach(category => {
                    fetchAndBuildMovieSection(
                        apiPaths.fetchMovieList(category.id),
                        category.name
                    );
                });
            }
            // console.table(movies);
        })
        .catch(err => console.error(err));
}


function fetchAndBuildMovieSection(fetchUrl, categoryName) {
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            // console.table(res.results);
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies, categoryName);
            }
            return movies;
        })
        .catch(err => console.error(err));
}

function buildMoviesSection(list, categoryName) {
    console.log(list, categoryName);

    const moviesCont = document.getElementById('movies-cont');

    const moviesListHTML = list.map(item => {
        return `
        <img class= "movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')">
        `;
    }).join('');

    const moviesSectionHTML = `
    <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
    <div class="movies-row">
    ${moviesListHTML}
    </div>
    `

    // console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;

    moviesCont.append(div);


}

function searchMovieTrailer(movieName) {
    if(!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        // console.log(res.items[0]);
        const searchResult = res.items[0];
        const youTubeUrl = `https://www.youtube.com/watch/?v=${searchResult.id.videoId}`;
        // console.log(youTubeUrl);
        window.open(youTubeUrl, '_blank');
    })
    .catch(err => console.error(err));
}

window.addEventListener('load', function () {
    init();
    window.addEventListener('scroll', function () {
        const header = this.document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
});



