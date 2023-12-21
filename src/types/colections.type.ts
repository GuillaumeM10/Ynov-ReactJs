export interface UserDetailsType {
  admin: boolean;
  userId: string;
  likes?: number[];
  rates?: {
    movieId: number;
    rate: number;
  }[];
  comments?: {
    id: string;
    movieId: number;
    text: string;
  }[];
}

export interface MovieComment{
  id: string;
  userId: string;
  displayName?: string;
  photoURL?: string;
  text: string;
}
export interface MoviesColection {
  movieId: string;
  likes: number;
  rates: number[];
  comments: MovieComment[];
}
