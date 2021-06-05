import React from 'react'
import PropTypes from 'prop-types'

function PreviewMovie({ movie }) {

    const {
        title,
        vote_average,
        poster_path
    } = movie;

    return (
            <div className="preview-movie">
                <div className="preview-movie__image-container">
                    <img
                        alt={title}
                        className="preview-movie__image"
                        src={`https://image.tmdb.org/t/p/w500/${poster_path}`}/>
                </div>
                <div className="preview-movie__details">
                    <div className="preview-movie__title">
                        <span className="movie-name">{title}</span>
                    </div>
                    <span className="preview-movie__rating">
                        IMDB: {vote_average}
                    </span>
                </div>
            </div>
    )
}

PreviewMovie.propTypes = {
    movie: PropTypes.object
}

export default PreviewMovie

