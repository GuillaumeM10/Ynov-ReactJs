export interface UserDetailsRates {
  id: string;
  movieId: number;
  rate: number;
}

export interface UserDetailsComments {
  id: string;
  movieId: number;
  text: string;
}

export interface UserDetailsType {
  admin: boolean;
  userId: string;
  likes?: number[];
  rates?: UserDetailsRates[];
  comments?: UserDetailsComments[];
}

export interface MovieComment{
  id: string;
  userId: string;
  displayName?: string;
  photoURL?: string;
  text: string;
}

export interface MovieRate{
  id: string;
  userId: string;
  rate: number;
  displayName?: string;
  photoURL?: string;
}
export interface MoviesColection {
  movieId: string;
  likes: number;
  rates: MovieRate[];
  comments: MovieComment[];
}
