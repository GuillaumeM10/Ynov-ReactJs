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

export interface MoviesColection {
  movieId: string;
  likes: number;
  rates: number[];
  comments: {
    id: string;
    userId: string;
    text: string;
  }[];
}
