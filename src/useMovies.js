import { useEffect, useState } from "react";

const KEY = "61cd0fa6";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    callback?.(); //este es el closeMovie()

    const controller = new AbortController();
    let timer;

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // Limpiar el temporizador anterior si existe
    if (timer) {
      clearTimeout(timer);
    }

    // Iniciar un nuevo temporizador
    timer = setTimeout(() => {
      fetchMovies();
    }, 500); // Establece el tiempo de espera deseado (en milisegundos)

    return () => {
      // Asegúrate de abortar el controlador si el componente se desmonta
      // o si el efecto se vuelve a ejecutar antes de que se complete la
      // solicitud
      controller.abort();
      clearTimeout(timer); // Limpia el temporizador en la limpieza del efecto
    };
  }, [query]);

  return { movies, isLoading, error };
}
