interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Movie {
  title: string | undefined;
  poster_path: string | undefined;
  id: number | undefined;
  overview: string | undefined;
  release_date: string | undefined;
  vote_average: number | undefined;
  vote_count: number | undefined;
  runtime: number | undefined;
  revenue: number | undefined;
  genres: Genre[];
  budget: number | undefined;
  backdrop_path: string | undefined;
  adult: boolean | undefined;
  homepage: string | undefined;
  imdb_id: string | undefined;
  original_language: string | undefined;
  original_title: string | undefined;
  popularity: number | undefined;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string | undefined;
  tagline: string | undefined;
}

export interface MovieFirebase {
  likes?: number;
  movieId?: number;
  rates?: number[];
  comments?: {
    userId: string;
    text: string;
  }[];
};

export interface Movies {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface FetchMovies {
  page: number;
  total_pages: number;
  results: Movie[];
  total_results: number;
}

export interface Cast {
  id: number;
  character: string;
  name: string;
  original_name: string;
  profile_path: string;
  cast_id: number;
  credit_id: string;
  order: number;
  popularity: number;
  known_for_department: string;
  gender: number;
  adult: boolean;
}

export interface Crew {
  id: number;
  department: string;
  job: string;
  name: string;
  original_name: string;
  profile_path: string;
  credit_id: string;
  popularity: number;
  known_for_department: string;
  gender: number;
  adult: boolean;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}
