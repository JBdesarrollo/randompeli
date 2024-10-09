
const apiKey = import.meta.env.VITE_API; // Obtener la clave de API de TMDB
//const apiKey = import.meta.env.API; // Obtener la clave de API de TMDB

const movieId = '550'; // Reemplaza con el ID de la película que deseas obtener

console.log(import.meta.env);
async function fetchMovieData() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const movieData = await response.json();
        console.log(movieData);
        // Aquí puedes procesar y mostrar la información de la película en tu aplicación
    } catch (error) {
        console.error('Error al obtener la información de la película:', error);
    }
}

// Llama a la función para hacer el fetch
fetchMovieData();
