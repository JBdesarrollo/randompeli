const apiKey = import.meta.env.VITE_API; // Obtener la clave de API de TMDB

// Ocultar la pantalla de carga y la tarjeta de la película al inicio
document.getElementById('loading').style.display = 'flex';
document.getElementById('movie-card').style.display = 'none';

// Función para obtener una película aleatoria
async function fetchRandomMovie() {
    try {
        const randomMovieId = Math.floor(Math.random() * 10000) + 1; // ID aleatorio entre 1 y 10000
        const response = await fetch(`https://api.themoviedb.org/3/movie/${randomMovieId}?api_key=${apiKey}&language=es-ES`);
        const movie = await response.json();

        // Verificar si la película existe
        if (movie.id) {
            displayMovieData(movie);
        } else {
            console.error('No se encontró una película aleatoria.'); // Manejar el caso en que no se encuentre la película
            fetchRandomMovie(); // Intentar nuevamente si no se encontró la película
        }
    } catch (error) {
        console.error('Error al obtener la película aleatoria:', error);
    } finally {
        document.getElementById('loading').style.display = 'none'; // Ocultar pantalla de carga al final
    }
}

// Llamar a la función para obtener una película aleatoria al iniciar
fetchRandomMovie();


// También agregar evento para cuando se presiona "Enter"
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value;
        if (query) {
            fetchMovieByTitle(query);
        }
    }
});

// Función para buscar película por título
// Función para buscar película por título
async function fetchMovieByTitle(title) {
    document.getElementById('loading').style.display = 'flex'; // Mostrar pantalla de carga
    document.getElementById('movie-card').style.display = 'none'; // Ocultar tarjeta de película

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&language=es-ES`);
        const data = await response.json();

        if (data.results.length > 0) {
            const movie = data.results[0]; // Tomar la primera película del resultado
            console.log(movie); // Ver el objeto de película
            displayMovieData(movie);
        } else {
            alert('No se encontraron películas con ese título.');
            clearMovieData();
        }
    } catch (error) {
        console.error('Error al buscar la película:', error);
    } finally {
        document.getElementById('loading').style.display = 'none'; // Ocultar pantalla de carga al final
    }
}

// Mostrar los datos de la película en la página
function displayMovieData(movie) {
    if (!movie) {
        console.error('No hay datos de película para mostrar.');
        clearMovieData();
        return;
    }

    document.getElementById('movie-title').innerHTML = movie.title || 'Título no disponible';
    document.getElementById('movie-overview').innerHTML = movie.overview || 'Descripción no disponible';
    document.getElementById('movie-release-date').innerHTML = movie.release_date || 'Fecha no disponible';
    document.getElementById('movie-rating').innerHTML = movie.vote_average || 'Calificación no disponible';
    document.getElementById('star-rating').innerHTML = getStarRating(movie.vote_average || 0);

    // Asegurarse de que genres y production_countries sean arreglos antes de intentar mapear
    document.getElementById('movie-genres').innerHTML = Array.isArray(movie.genres) ? movie.genres.map(genre => genre.name).join(', ') : 'Géneros no disponibles';
    document.getElementById('movie-origin-country').innerHTML = Array.isArray(movie.production_countries) ? movie.production_countries.map(country => country.name).join(', ') : 'Países no disponibles';
    document.getElementById('movie-original-language').innerHTML = movie.original_language || 'Idioma no disponible';
    document.getElementById('movie-poster').src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'ruta/imagen/no_disponible.jpg'; // Imagen por defecto si no hay poster
    document.getElementById('movie-card').style.display = 'block'; // Mostrar tarjeta de película
    document.getElementById('search-input').value = '';
}


// Limpiar datos de la película en caso de error
function clearMovieData() {
    document.getElementById('movie-title').innerHTML = '';
    document.getElementById('movie-overview').innerHTML = '';
    document.getElementById('movie-release-date').innerHTML = '';
    document.getElementById('movie-rating').innerHTML = '';
    document.getElementById('star-rating').innerHTML = '';
    document.getElementById('movie-genres').innerHTML = '';
    document.getElementById('movie-origin-country').innerHTML = '';
    document.getElementById('movie-original-language').innerHTML = '';
    document.getElementById('movie-poster').src = '';
}

// Obtener calificación en estrellas
function getStarRating(vote) {
    const stars = Math.round(vote / 2); // Convertir a estrellas (0-5)
    return '⭐'.repeat(stars) + '☆'.repeat(5 - stars); // Generar cadena de estrellas
}

// Agregar evento para mostrar sugerencias
document.getElementById('search-input').addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length > 0) {
        await searchMovies(query);
    } else {
        clearSuggestions();
    }
});

// Función para buscar películas y mostrar sugerencias
async function searchMovies(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=es-ES`);
        const data = await response.json();
        displaySuggestions(data.results);
    } catch (error) {
        console.error('Error al buscar películas:', error);
    }
}

// Mostrar sugerencias en el DOM
function displaySuggestions(movies) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = ''; // Limpiar sugerencias anteriores

    if (movies.length === 0) {
        const noResultsItem = document.createElement('div');
        noResultsItem.className = 'suggestion-item';
        noResultsItem.textContent = 'No se encontraron películas';
        suggestionsContainer.appendChild(noResultsItem);
        return;
    }

    movies.forEach(movie => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = movie.title;
        suggestionItem.addEventListener('click', () => {
            document.getElementById('search-input').value = movie.title; // Colocar el título
            fetchMovieByTitle(movie.title); // Buscar la película al hacer clic
            clearSuggestions(); // Limpiar sugerencias
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

// Limpiar sugerencias
function clearSuggestions() {
    document.getElementById('suggestions').innerHTML = '';
}
