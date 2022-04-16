import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import ImageError from "@/assets/images/no-image.png";

type PreviewMovieProps = {
  movie: {
    title: string;
    poster_path: string;
    vote_average: string;
  };
};
function PreviewMovie({ movie }: PreviewMovieProps) {
  const { title, vote_average, poster_path } = movie;
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="preview-movie">
      <div className="preview-movie__image-container">
        <>
          {imageLoading && (
            <Skeleton
              height="100%"
              duration={1}
              containerClassName="avatar-skeleton"
            />
          )}
          <img
            src={`https://image.tmdb.org/t/p/w342/${poster_path}`}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={({currentTarget}) => {
              currentTarget.onerror = null
              currentTarget.src = ImageError
              return currentTarget
            }}
            className="preview-movie__image"
          />
        </>
      </div>
      <div className="preview-movie__details">
        <div className="preview-movie__title">
          <span className="movie-name">{title}</span>
        </div>
        <span className="preview-movie__rating">IMDB: {vote_average}</span>
      </div>
    </div>
  );
}

export default PreviewMovie;

