export interface UserDetailsType {
  admin: boolean;
  pseudo: string;
  ratesId: string;
  userId: string;
  likes: string[];
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
