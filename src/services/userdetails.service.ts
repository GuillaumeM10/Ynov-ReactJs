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
import { db } from "./firebase.service";
import { Movie } from "../types/movie.type";
import MovieService from "./movies.service";

export type UserDetailsServiceType = {
  createUserdetailsColection: (
    userId: string
  ) => Promise<DocumentReference<DocumentData, DocumentData> | undefined>;
  getUserDetails: (
    userId: string
  ) => Promise<QueryDocumentSnapshot<DocumentData, DocumentData>>;
  toggleLikeMovie: (userId: string, movie: Movie) => Promise<void>;
};

const createUserdetailsColection = async (userId: string) => {
  if (!userId) return;

  try {
    const userdetails = await getUserDetails(userId);
    if (!userdetails.empty) return;

    const resp = await addDoc(collection(db, "userDetails"), {
      userId,
    });
    return resp;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

const getUserDetails = async (userId: string) => {
  const collectionUserDetails = collection(db, "userDetails");
  const q = query(collectionUserDetails, where("userId", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const toggleLikeMovie = async (userId: string, movie: Movie) => {
  // check if movie id is in userdetails colection in "likes[]", if is in remove it if not add it
  const movieId = movie.id;
  const movieExists = await MovieService.getMovieData(movie);
  
  try{
    const userData = await getUserDetails(userId).data();
    console.log(userData);
    
    if(!userData.likes){
      await updateDoc(doc(db, "userDetails", userData.id), {
        likes: [movieId],
      })
    }else{
      const likes = userData.likes;

      if(likes.includes(movieId)){
        // remove like
        await updateDoc(doc(db, "userDetails", userData.id), {
          likes: likes.filter((id: number) => id !== movieId),
        })
      }else{
        // add like
        await updateDoc(doc(db, "userDetails", userData.id), {
          likes: [...likes, movieId],
        })
      }
    };

    if(!movieExists){
      await addDoc(collection(db, "Movies"), {
        movieId: movie.id,
        likes: 1,
      });
    }
  }catch(error){
    console.log(error);
    throw error;
  }
}

const UserDetailsService: UserDetailsServiceType = {
  createUserdetailsColection,
  getUserDetails,
  toggleLikeMovie
};

export default UserDetailsService;
