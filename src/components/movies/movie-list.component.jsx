import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


const MovieList = ({ movies = [], setCurrentIndex}) => {
    const [currentIndex, setIndex] = useState(0)

    const setCurrentIndexHandler = (index) => {
        setCurrentIndex(index)
        setIndex(index)
    }

    useEffect(() => {
        const counter = setInterval(function(){
            setCurrentIndexHandler(index => {
                return index === 3 ? 0: index + 1
            })
        }, 1000)
        return () => {
            clearInterval(counter)
        }
    }, [currentIndex])

    return (
        <div className='movie__list'>
            {movies.map((movie, i) =>(
                <div  
                    onClick={() => setCurrentIndexHandler(i)}
                    key={i}
                    className={`movie__item  ${i === currentIndex ? "active": ""}`}>
                    <img 
                        src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
                        alt={movie.title} />
                </div>
            ))}
        </div>
    );
};


MovieList.propTypes = {
    movies: PropTypes.array.isRequired,
    setCurrentIndex: PropTypes.func.isRequired
};


export default MovieList;
