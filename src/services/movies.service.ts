import { MovieComment, MovieRate } from "../types/colections.type";
import { Credits, Movie, Movies } from "../types/movie.type";
import api from "./api.service";
import { db } from "./firebase.service";
import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  addDoc,
  collection,
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

  getMovieData: (movieId: Movie["id"]) => Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | false> ;

  likeMovie: (movie: Movie) => Promise<DocumentReference<DocumentData, DocumentData> | void >;

  removeLikeMovie: (movie: Movie) => Promise<void>;

  addComment: (movieId: Movie["id"], userId: string, displayName: string | null, photoURL: string | null, text: string, id: string) => Promise<DocumentReference<DocumentData, DocumentData> | void>;
  
  removeComment: (movieId: Movie["id"], id: string) => Promise<DocumentReference<DocumentData, DocumentData> | void>;
  
  getMoviesWithComments: () => Promise<QueryDocumentSnapshot<DocumentData, DocumentData>[]>;

  addRate: (movieId: Movie["id"], userId: string, displayName: string | null, photoURL: string | null, rate: number, id: string) => Promise<DocumentReference<DocumentData, DocumentData> | void>;

  removeRate: (movieId: Movie["id"], id: string) => Promise<DocumentReference<DocumentData, DocumentData> | void>;

  getMoviesWithRates: () => Promise<QueryDocumentSnapshot<DocumentData, DocumentData>[]>;

  createMovie: (movieId: Movie["id"]) => Promise<void>;

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

const getMovieData = async (movieId: Movie["id"]) => {
  const q = query(collection(db, "Movies"), where("movieId", "==", movieId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return false;
  }

  return querySnapshot.docs[0];
};

const createMovie = async (movieId: Movie["id"]) => {
  try {
    await addDoc(collection(db, "Movies"), {
      movieId: movieId,
    });
  } catch (err) {
    console.log(err);
  }
}

const likeMovie = async (movie: Movie) => {
  const movieExists = await getMovieData(movie.id);

  try {
    
    if (movieExists) {

      const movieRef = doc(db, "Movies", movieExists.id);
      await updateDoc(movieRef, {
        likes: movieExists.data().likes ? movieExists.data().likes + 1 : 1,
      });
      return movieRef;

    } else {

      createMovie(movie.id);

    }
  } catch (err) {
      console.log(err);
  }
};

const removeLikeMovie = async (movie: Movie) => {
  
  try{
    const movieExists = await getMovieData(movie.id);
    
    if (movieExists) {
      console.log(movieExists.data().likes);
      const movieRef = doc(db, "Movies", movieExists.id);
      if (movieExists.data().likes - 1 < 1 || !movieExists.data().likes) {
        await updateDoc(movieRef, {
          likes: 0,
        });
      } else {
        await updateDoc(movieRef, {
          likes: movieExists.data().likes - 1,
        });
      }
    }
  }catch(err){
    console.log(err);
    throw err;
  }
};

const addComment = async (
  movieId: Movie["id"],
  userId: string, 
  displayName: string | null, 
  photoURL: string | null, 
  text: string,
  id: string
) => {
  try {
    const movieExists = await getMovieData(movieId);
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
        movieId: movieId,
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
  } catch (err) {
    console.log(err);
  }
}

const removeComment = async (movieId: Movie["id"], id: string) => {
  try {
    const movieExists = await getMovieData(movieId);

    if (movieExists) {
      const movieRef = doc(db, "Movies", movieExists.id);
      
      await updateDoc(movieRef, {
        comments: movieExists.data().comments.filter((comment: MovieComment) => comment.id !== id),
      });
      return movieRef;
    }
  } catch (err) {
    console.log(err);
  }
}

const getMoviesWithComments = async () => {
  const q = query(collection(db, "Movies"), where("comments", "!=", []));
  const querySnapshot = await getDocs(q);  
  return querySnapshot.docs;
}

const addRate = async (
  movieId: Movie["id"],
  userId: string, 
  displayName: string | null, 
  photoURL: string | null, 
  rate: number,
  id: string
) => {
  try {
    const movieExists = await getMovieData(movieId);
    if (movieExists) {
      const movieRef = doc(db, "Movies", movieExists.id);
      
      if(movieExists.data().rates){
        
        if (movieExists.data().rates.some((rate: MovieRate) => rate.userId === userId)) {
          
          await updateDoc(movieRef, {
            rates: movieExists.data().rates.map((thisRate: MovieRate) => {
              if(thisRate.userId === userId){
                return {
                  ...thisRate,
                  rate: rate,
                }
              }
              return thisRate;
            }),
          });

        }else{
          await updateDoc(movieRef, {
            rates: [...movieExists.data().rates, { 
              userId,
              displayName,
              photoURL,
              rate, 
              id 
            }],
          });

        }
        return movieRef;
        
      }else{
        await updateDoc(movieRef, {
          rates: [{ 
            userId,
            displayName,
            photoURL,
            rate, 
            id 
          }],
        });
      }
      return movieRef;
    }else{
      
      const docRef = await addDoc(collection(db, "Movies"), {
        movieId: movieId,
        rates: [
          {
            displayName,
            photoURL,
            rate, 
            id 
          }
        ],
      });
      return docRef;
    }
  } catch (err) {
    console.log(err);
  }
}

const removeRate = async (movieId: Movie["id"], id: string) => {
  try {
    const movieExists = await getMovieData(movieId);

    if (movieExists) {
      const movieRef = doc(db, "Movies", movieExists.id);
      
      await updateDoc(movieRef, {
        rates: movieExists.data().rates.filter((rate: MovieRate) => rate.id !== id),
      });
      return movieRef;
    }
  } catch (err) {
    console.log(err);
  }
}

const getMoviesWithRates = async () => {
  const q = query(collection(db, "Movies"), where("rates", "!=", []));
  const querySnapshot = await getDocs(q);  
  return querySnapshot.docs;
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
  getMoviesWithComments,
  addRate,
  removeRate,
  getMoviesWithRates,
  createMovie
};

export default MovieService;
