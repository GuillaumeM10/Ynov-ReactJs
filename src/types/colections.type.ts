export interface UserDetailsType {
  admin: boolean;
  userId: string;
  likes?: number[];
  rates?: {
    movieId: number;
    rate: number;
  }[];
  comments?: {
    movieId: number;
    text: string;
  }[];
}

export interface MobiesColection {
  movieId: string;
  likes: number;
  rates: number[];
  comments: {
    userId: string;
    text: string;
  }[];
}
