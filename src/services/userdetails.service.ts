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
import { UserDetailsComments, UserDetailsRates, UserDetailsType } from "../types/colections.type";

export type UserDetailsServiceType = {

  createUserdetailsColection: (
    userId: string
  ) => Promise<DocumentReference<DocumentData, DocumentData> | undefined>;
  
  getUserDetails: (
    userId: string
  ) => Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | void>;

  toggleLikeMovie: (userId: string, movie: Movie) => Promise<UserDetailsType | void>;

  toggleIsAdmin: (userId: string, isAdmin: boolean) => Promise<DocumentData | void>;

  addComment: (userId: string, movie: Movie, text: string, id: string) => Promise<DocumentData | void>;

  removeComment: (userId: string, id: string) => Promise<DocumentData | void>;

  addRate: (userId: string, movie: Movie, rate: number, id: string) => Promise<DocumentData | void>;

  removeRate: (userId: string, id: string) => Promise<DocumentData | void>;
};

const createUserdetailsColection = async (userId: string) => {
  if (!userId) return;

  try {
    const resp = await addDoc(collection(db, "userDetails"), {
      userId,
    });

    return resp;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUserDetails = async (userId: string) => {
  const collectionUserDetails = collection(db, "userDetails");
  const q = query(collectionUserDetails, where("userId", "==", userId));

  if (!q) return;

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const toggleLikeMovie = async (userId: string, movie: Movie) => {
  try {
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const likedMovies = userDetails.data().likes;

    if (!likedMovies) {
      await updateDoc(doc(db, "userDetails", userDetailsId), {
        likes: [movie.id],
      });
      return ;
    }

    const isLiked = likedMovies.includes(movie.id);
    if (isLiked) {
      await updateDoc(doc(db, "userDetails", userDetailsId), {
        likes: likedMovies.filter((id: number) => id !== movie.id),
      });
    } else {

      await updateDoc(doc(db, "userDetails", userDetailsId), {
        likes: [
          ...likedMovies, 
          movie.id
        ],
      });

    }

    return userDetails.data() as UserDetailsType;
  } catch (err) {
    console.log(err);
  }
};

const toggleIsAdmin = async (userId: string, isAdmin: boolean) => {
  try{
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const userDetailsData = userDetails.data();

    await updateDoc(doc(db, "userDetails", userDetailsId), {
      ...userDetailsData,
      admin : isAdmin
    });

    return userDetails.data();
  }catch (err) {
    console.log(err);
  }
}

const addComment = async (
  userId: string, 
  movie: Movie, 
  text: string, 
  id: string
) => {

  try{
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const userDetailsData = userDetails.data();

    if(userDetailsData.comments){
      await updateDoc(doc(db, "userDetails", userDetailsId), {
        ...userDetailsData,
        comments: [
          ...userDetailsData.comments,
          {
            movieId: movie.id,
            text,
            id
          }
        ]
      });
    }else{
      await updateDoc(doc(db, "userDetails", userDetailsId), {
        ...userDetailsData,
        comments: [
          {
            movieId: movie.id,
            text,
            id
          }
        ]
      });
    }
    return userDetails.data();
  }catch (err) {
    console.log(err);
  }
}

const removeComment = async (userId: string, id: string) => {
  try{
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const userDetailsData = userDetails.data();

    await updateDoc(doc(db, "userDetails", userDetailsId), {
      ...userDetailsData,
      comments: userDetailsData.comments.filter((comment: UserDetailsComments) => comment.id !== id)
    });

    return userDetails.data();
  }catch (err) {
    console.log(err);
  }
}

const addRate = async (
  userId: string, 
  movie: Movie, 
  rate: number, 
  id: string
) => {

  try{
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const userDetailsData = userDetails.data();

    if(userDetailsData.rates){
      if (userDetailsData.rates.find((rate: UserDetailsRates) => rate.movieId === movie.id)) {

        await updateDoc(doc(db, "userDetails", userDetailsId), {
          ...userDetailsData,
          rates: userDetailsData.rates.map((thisRate: UserDetailsRates) => {
            if (thisRate.movieId === movie.id) {
              return {
                ...thisRate,
                rate: rate,
              };
            }
            return thisRate;
          })
        });

        return userDetails.data();

      }else{
        
        await updateDoc(doc(db, "userDetails", userDetailsId), {
          ...userDetailsData,
          rates: [
            ...userDetailsData.rates,
            {
              movieId: movie.id,
              rate,
              id
            }
          ]
        });

      }
     
    }else{
      
      await updateDoc(doc(db, "userDetails", userDetailsId), {
        ...userDetailsData,
        rates: [
          {
            movieId: movie.id,
            rate,
            id
          }
        ]
      });
    }
    return userDetails.data();
  }catch (err) {
    console.log(err);
  }
}

const removeRate = async (userId: string, id: string) => {
  try{
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const userDetailsData = userDetails.data();

    await updateDoc(doc(db, "userDetails", userDetailsId), {
      ...userDetailsData,
      rates: userDetailsData.rates.filter((rate: UserDetailsRates) => rate.id !== id)
    });

    return userDetails.data();
  }catch (err) {
    console.log(err);
  }
}

const UserDetailsService: UserDetailsServiceType = {
  createUserdetailsColection,
  getUserDetails,
  toggleLikeMovie,
  toggleIsAdmin,
  addComment,
  removeComment,
  addRate,
  removeRate
};

export default UserDetailsService;
