import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import ImageError from "@/assets/images/no-image.png";


interface MovieListProps {
  movies: Array<{ poster_path: string; title: string }>;
  setCurrentIndex: (e: number) => void;
}

const MovieList = ({ movies = [], setCurrentIndex }: MovieListProps) => {
  const [currentIndex, setIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const setCurrentIndexHandler = (index: number) => {
    setCurrentIndex(index);
    setIndex(index);
  };

  return (
    <div className="movie__list">
      {movies.map((movie, i) => (
        <div
          onClick={() => setCurrentIndexHandler(i)}
          key={i}
          className={`movie__item  ${i === currentIndex ? "active" : ""}`}
        >
          <>
            {imageLoading && (
              <Skeleton
                height="100%"
                duration={1}
                containerClassName="avatar-skeleton"
              />
            )}
            <img
              src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = ImageError;
                return currentTarget;
              }}
            />
          </>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
