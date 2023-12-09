import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "61cd0fa6";

export default function App() {
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(() => {
  //   const localWatched = localStorage.getItem("watched");
  //   return localWatched ? JSON.parse(localWatched) : [];
  // });
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelecMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatchedMovie(watchedMovie) {
    setWatched((watched) => [...watched, watchedMovie]);
    //localStorage.setItem("watched", JSON.stringify([...watched, watchedMovie]));
  }

  function handleUpdateRating(newWatchedArray) {
    setWatched(newWatchedArray);
  }

  function handleDeleteWatched(id) {
    const filteredWatchedArr = watched.filter((movie) => movie.imdbID !== id);
    setWatched(filteredWatchedArr);
  }

  // useEffect(() => {
  //   const controller = new AbortController();
  //   let timer;

  //   async function fetchMovies() {
  //     try {
  //       setIsLoading(true);
  //       setError("");
  //       const res = await fetch(
  //         `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //         { signal: controller.signal }
  //       );
  //       if (!res.ok) throw new Error("Something went wrong");

  //       const data = await res.json();
  //       if (data.Response === "False") throw new Error("Movie not found");

  //       setMovies(data.Search);
  //       setError("");
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         setError(err.message);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   if (query.length < 3) {
  //     setMovies([]);
  //     setError("");
  //     return;
  //   }

  //   // Limpiar el temporizador anterior si existe
  //   if (timer) {
  //     clearTimeout(timer);
  //   }

  //   // Iniciar un nuevo temporizador
  //   timer = setTimeout(() => {
  //     handleCloseMovie();
  //     fetchMovies();
  //   }, 500); // Establece el tiempo de espera deseado (en milisegundos)

  //   return () => {
  //     // Asegúrate de abortar el controlador si el componente se desmonta
  //     // o si el efecto se vuelve a ejecutar antes de que se complete la
  //     // solicitud
  //     controller.abort();
  //     clearTimeout(timer); // Limpia el temporizador en la limpieza del efecto
  //   };
  // }, [query]);

  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelecMovie}
              watched={watched}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onRateMovie={handleWatchedMovie}
              watched={watched}
              onUpdateRating={handleUpdateRating}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    setQuery("");
    inputEl.current.focus();
  });

  // useEffect(() => {
  //   function callback(e) {
  //     if (document.activeElement === inputEl.current) return;
  //     if (e.key === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   }
  //   document.addEventListener("keydown", callback);
  //   return () => {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onRateMovie,
  watched,
  onUpdateRating,
}) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const foundMovie = watched.find((movie) => movie.imdbID === selectedId);
  const [rateGiven, setRateGiven] = useState(
    foundMovie === undefined ? 0 : foundMovie
  );

  const countRef = useRef(0);

  useEffect(() => {
    if (rateGiven === 0) {
      countRef.current = 0;
    } else {
      countRef.current = countRef.current + 1;
    }
  }, [rateGiven]);

  function handleRateGiven(rating) {
    setRateGiven(rating);
  }

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedMovie.imdbID,
      Title: selectedMovie.Title,
      Year: selectedMovie.Year,
      Poster: selectedMovie.Poster,
      runtime: Number(selectedMovie.Runtime.split(" ").at(0)),
      imdbRating: Number(selectedMovie.imdbRating),
      userRating: rateGiven,
      countRatingDecisions: countRef.current,
    };
    if (foundMovie) return;
    onRateMovie(newWatchedMovie);
    onCloseMovie();
  }

  function handleUpdateScore() {
    const updatedWatchedMovies = watched.map((movie) => {
      if (movie.imdbID === selectedId) {
        movie.userRating = rateGiven;
      }
      return movie;
    });
    onUpdateRating(updatedWatchedMovies);
    onCloseMovie();
  }

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    Year: year,
    imdbRating: imdbRating,
    Director: director,
    Actors: actors,
    Genre: genre,
    Released: released,
  } = selectedMovie;

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setSelectedMovie(data);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie: ${title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [selectedMovie]);

  useKey("Escape", onCloseMovie);

  // useEffect(() => {
  //   function callback(e) {
  //     if (e.key === "Escape") {
  //       onCloseMovie();
  //     }
  //   }

  //   document.addEventListener("keydown", callback);

  //   return function () {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, [onCloseMovie]);

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster for ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {runtime} - {released}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                setOtherState={handleRateGiven}
                defaultRating={
                  foundMovie === undefined ? 0 : foundMovie.userRating
                }
              />

              {foundMovie
                ? rateGiven > 0 && (
                    <button className="btn-add" onClick={handleUpdateScore}>
                      ↕ Update Score
                    </button>
                  )
                : rateGiven > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          onClick={() => onDeleteWatched(movie.imdbID)}
          className="btn-delete"
        >
          X
        </button>
      </div>
    </li>
  );
}
