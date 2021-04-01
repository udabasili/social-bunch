import React, { useEffect, useState } from 'react';
import MovieList from './movies/movie-list.component';
import axios from 'axios';
import PreviewMovie from './movies/preview-movie.component';
import Loading from './loader.component';

const MOVIE_API = process.env.REACT_APP_MOVIE_API;

export default function Movie() {

    const [movies, setMovies] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const movieApiLink = async () => {
        const baseUrl = "https://api.themoviedb.org/3";
        const relativeUrl = "/discover/movie";
        const fullUrl = `${baseUrl}${relativeUrl}?api_key=${MOVIE_API}`;
        const config = {
            headers: {
            }
        }
        var instance = axios.create();
        delete instance.defaults.headers.common['X-CSRF-Token'];
        return instance.get(fullUrl)
    };

    useEffect(() => {
        movieApiLink()
            .then(response => {
                let  movieResponse = response.data.results;
                movieResponse = movieResponse.filter((movie, index) => index < 4)
                setMovies(movieResponse)
                    
            })
        return () => {
            
        }
    }, [])


    return (
        <div className="movie">
            {
                !movies ?
                <Loading/> :
                <React.Fragment>
                    <PreviewMovie 
                        movie={movies[currentIndex]}/>
                    <MovieList
                        setCurrentIndex={setCurrentIndex}
                        movies={movies}
                        />
                </React.Fragment>
            }         
        </div>
    )
}
