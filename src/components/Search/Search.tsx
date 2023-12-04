import { Link } from "react-router-dom";
import { Movie } from "../../types/movie.type";
import { useState, useEffect, useRef } from "react";
import CrudService from "../../services/movies.service";
import { Timeout } from 'timers';
import "./search.scss";
import Unknown from "../../assets/unknown.jpg";

export interface SearchProps {
  burgerActive: boolean;
}

const Search = ({ burgerActive } : SearchProps) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<JSX.IntrinsicElements.div>(null);

  useEffect(() => {
    const handleClickOutside = (event : any) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchInputClick = () => {
    setFocused(true);
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const debounce = (func: any) => {
    let timer: Timeout | null;
    return (...args: any[]) => {
        const context: any = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            func.apply(context, args);
        }, 500);
    };
};

  const debouncedOnChange = debounce(handleSearch);

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      try {
        const data = await CrudService.searchMovies(search);

        setData(data.results);
        if(data.length === 0) setError("Pas de résultats");
        else setError("");
      } catch (error) {
        console.log(error as string);
      }
      setLoading(false)
    };
    
    if (search.length > 1) {      
      getData();
    } else {
      setData([]);
    }
  }, [search]);

  return (
    <div className={`searchbar-container ${burgerActive ? "active" : ""}`}>

      <div className="searchBar">
          <input 
            type="search" 
            placeholder="Rechercher"
            onChange={e => {
              debouncedOnChange(e)
              e.persist();
              if(e.target.value === "") setData([]);
              if(e.target.value.length > 0) e.target.parentElement?.classList.add("cross");
              else e.target.parentElement?.classList.remove("cross");
            }}
            onFocus={() => setFocused(true)}
            onClick={handleSearchInputClick}
          />
          <img src="/assets/search.svg" alt="" />
      </div>

      {focused && search.length > 1 && (
        <div className="results" ref={resultsRef}>
          <ul className="data bg2">
            {!error && !loading && data.length > 0 ? (data.map((movie : Movie) => (
              <li key={movie.id}>
                <Link to={`/movie/${movie.id}`} onClick={() => setFocused(false)}>
                <img
                    src={
                      movie.poster_path
                        ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
                        : Unknown
                    }
                    className="cover"
                    alt="cover"
                    width={100}
                    height={150}
                  />
                  <div className="content">
                    <h3>{movie.title}</h3>
                  </div>
                </Link>
              </li>
            ))) : (() => {
              if(data.length === 0 && !loading) return <li><p>Pas de résultats</p></li>;
              if(error) return <li><p>{error}</p></li>;
              if(loading) return <li><p>Chargement...</p></li>;
            })()}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;