import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieList from '@/features/movies/components/MovieList';
import PreviewMovie from '@/features/movies/components/MoviePreview';

const MOVIE_API = '1fcf7ebb22d996d1c50123bf39d4a4ca';

export default function Movie() {

    const [movies, setMovies] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const movieApiLink = async () => {
        const baseUrl = "https://api.themoviedb.org/3";
        const relativeUrl = "/discover/movie";
        const fullUrl = `${baseUrl}${relativeUrl}?api_key=${MOVIE_API}`;
        var instance = axios.create();
        delete instance.defaults.headers.common['X-CSRF-Token'];
        return instance.get(fullUrl)
    };

    useEffect(() => {
        movieApiLink()
            .then(response => {
                let  movieResponse = response.data.results;
                movieResponse = movieResponse.filter((movie: any, index: number) => index < 4)
                setMovies(movieResponse)
                    
            })
        return () => {
            
        }
    }, [])



    return (
        <div className="movie">
            {
                !movies ?
                <div className="movie-loading"/> :
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
