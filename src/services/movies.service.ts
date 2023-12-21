import { MovieComment } from "../types/colections.type";
import { Credits, Movie, Movies } from "../types/movie.type";
import api from "./api.service";
import { db } from "./firebase.service";
import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export type MovieServiceType = {

  popularMovies: (page?: number) => Promise<Movies>;

  getMovieById: (id: number) => Promise<Movie>;

  searchMovies: (query: string) => Promise<Movies>;

  getCredits: (id: number) => Promise<Credits>;

  getMovieData: (movie: Movie) => Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | false> ;

  likeMovie: (movie: Movie) => Promise<DocumentReference<DocumentData, DocumentData> | void >;

  removeLikeMovie: (movie: Movie) => Promise<void>;

  addComment: (movie: Movie, userId: string, displayName: string | null, photoURL: string | null, text: string, id: string) => Promise<DocumentReference<DocumentData, DocumentData> | void>;
  
  removeComment: (movie: Movie, id: string) => Promise<DocumentReference<DocumentData, DocumentData> | void>;
  
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

const getMovieById = async (id: number) => {
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

const getCredits = async (id: number) => {
  try {
    return (await api.get(`/movie/${id}/credits`)).data;
  } catch (err) {
    console.log(err);
  }
};

const getMovieData = async (movie: Movie) => {
  const q = query(collection(db, "Movies"), where("movieId", "==", movie.id));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return false;
  }

  return querySnapshot.docs[0];
};

const likeMovie = async (movie: Movie) => {
  const movieExists = await getMovieData(movie);

  try {
    
    if (movieExists) {

      const movieRef = doc(db, "Movies", movieExists.id);
      await updateDoc(movieRef, {
        likes: movieExists.data().likes + 1,
      });
      return movieRef;

    } else {

      const docRef = await addDoc(collection(db, "Movies"), {
        movieId: movie.id,
        likes: 1,
      });
      return docRef;

    }
  } catch (error) {
      console.log(error);
  }
};

const removeLikeMovie = async (movie: Movie) => {
  
  try{
    const movieExists = await getMovieData(movie);

    if (movieExists) {
      const movieRef = doc(db, "Movies", movieExists.id);
      if (movieExists.data().likes - 1 < 1) {
        await deleteDoc(movieRef);

      } else {
        await updateDoc(movieRef, {
          likes: movieExists.data().likes - 1,
        });
      }
    }
  }catch(error){
    console.log(error);
    throw error;
  }
};

// export interface MoviesColection {
//   movieId: string;
//   likes: number;
//   rates: number[];
  // comments: {
  //   id: string;
  //   displayName?: string;
  //   photoURL?: string;
  //   text: string;
  // }[];
// }

const addComment = async (
  movie: Movie, 
  userId: string, 
  displayName: string | null, 
  photoURL: string | null, 
  text: string,
  id: string
) => {
  try {
    const movieExists = await getMovieData(movie);
    if (movieExists) {
      const movieRef = doc(db, "Movies", movieExists.id);
      if(movieExists.data().comments){
        await updateDoc(movieRef, {
          comments: [...movieExists.data().comments, { 
            userId,
            displayName,
            photoURL,
            text, 
            id 
          }],
        });
      }else{
        await updateDoc(movieRef, {
          comments: [{ 
            userId,
            displayName,
            photoURL,
            text, 
            id 
          }],
        });
      }
      return movieRef;
    }else{
      const docRef = await addDoc(collection(db, "Movies"), {
        movieId: movie.id,
        comments: [
          {
            displayName,
            photoURL,
            text, 
            id 
          }
        ],
      });
      return docRef;
    }
  } catch (error) {
    console.log(error);
  }
}

const removeComment = async (movie: Movie, id: string) => {
  try {
    const movieExists = await getMovieData(movie);

    if (movieExists) {
      const movieRef = doc(db, "Movies", movieExists.id);
      
      await updateDoc(movieRef, {
        comments: movieExists.data().comments.filter((comment: MovieComment) => comment.id !== id),
      });
      return movieRef;
    }
  } catch (error) {
    console.log(error);
  }
}


const MovieService: MovieServiceType = {
  popularMovies,
  getMovieById,
  searchMovies,
  getCredits,
  getMovieData,
  likeMovie,
  removeLikeMovie,
  addComment,
  removeComment,
};

export default MovieService;
