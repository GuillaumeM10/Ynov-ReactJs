import { Movie } from "../types/movie.type";
import api from "./api.service";
import { db } from "./firebase.service";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export type CrudServiceType = {
  popularMovies: (page?: number) => Promise<any>;
  getMovieById: (id: string) => Promise<any>;
  searchMovies: (query: string) => Promise<any>;
  getCredits: (id: string) => Promise<any>;
  getLikeMovie: (movie: Movie) => Promise<any>;
  likeMovie: (movie: Movie) => Promise<any>;
  removeLikeMovie: (movie: Movie) => Promise<any>;
};

const popularMovies = async (page?: number) => {
  let endPoint: string = "/movie/popular";
  if (page) {
    endPoint = `/movie/popular?page=${page}`;
  }

  try {
    return (await api.get(endPoint)).data;
  } catch (err) {
    console.log(err);
  }
};

const getMovieById = async (id: string) => {
  try {
    return (await api.get(`/movie/${id}`)).data;
  } catch (err) {
    console.log(err);
  }
};

const searchMovies = async (query: string) => {
  try {
    return (await api.get(`/search/movie?query=${query}`)).data;
  } catch (err) {
    console.log(err);
  }
};

const getCredits = async (id: string) => {
  try {
    return (await api.get(`/movie/${id}/credits`)).data;
  } catch (err) {
    console.log(err);
  }
};

const getLikeMovie = async (movie: Movie) => {
  const moviesRef = collection(db, "Movies");
  const q = query(moviesRef, where("movieId", "==", movie.id));

  try {
    const querySnapshot = await getDocs(q);
    const movieExists = querySnapshot.docs[0];
    return movieExists;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const likeMovie = async (movie: Movie) => {
  const movieExists = await getLikeMovie(movie);

  //if movie exists, updtade likes
  if (movieExists) {
    const movieRef = doc(db, "Movies", movieExists.id);
    await updateDoc(movieRef, {
      likes: movieExists.data().likes + 1,
    });
    console.log("Document updated with ID: ", movieRef.id);
    return movieRef;
  } else {
    const docRef = await addDoc(collection(db, "Movies"), {
      movieId: movie.id,
      likes: 1,
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  }
};

const removeLikeMovie = async (movie: Movie) => {
  const movieExists = await getLikeMovie(movie);

  //if movie exists, updtade likes
  if (movieExists) {
    const movieRef = doc(db, "Movies", movieExists.id);
    await updateDoc(movieRef, {
      likes: movieExists.data().likes - 1,
    });
    console.log("Document updated with ID: ", movieRef.id);
    return movieRef;
  }
};

const CrudService: CrudServiceType = {
  popularMovies,
  getMovieById,
  searchMovies,
  getCredits,
  getLikeMovie,
  likeMovie,
  removeLikeMovie,
};

export default CrudService;
