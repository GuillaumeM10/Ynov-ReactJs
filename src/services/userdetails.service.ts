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
import { UserDetailsType } from "../types/colections.type";

export type UserDetailsServiceType = {

  createUserdetailsColection: (
    userId: string
  ) => Promise<DocumentReference<DocumentData, DocumentData> | undefined>;
  
  getUserDetails: (
    userId: string
  ) => Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | void>;

  updateUserDetails: (
    userId: string
  ) => Promise<DocumentData | void>;

  toggleLikeMovie: (userId: string, movie: Movie) => Promise<UserDetailsType | void>;

  toggleIsAdmin: (userId: string, isAdmin: boolean) => Promise<DocumentData | void>;

  addComments: (userId: string, movie: Movie, text: string, id: string) => Promise<DocumentData | void>;

  removeComments: (userId: string, id: string) => Promise<DocumentData | void>;

};

const createUserdetailsColection = async (userId: string) => {
  if (!userId) return;

  try {
    const resp = await addDoc(collection(db, "userDetails"), {
      userId,
    });

    return resp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserDetails = async (userId: string) => {
  const collectionUserDetails = collection(db, "userDetails");
  const q = query(collectionUserDetails, where("userId", "==", userId));

  if (!q) return;

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const updateUserDetails = async (userId: string) => {
  try{
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const userDetailsData = userDetails.data();

    await updateDoc(doc(db, "userDetails", userDetailsId), {
      ...userDetailsData
    });

    return userDetails.data();
  }catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
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
  }catch (error) {
    console.log(error);
  }
}

// export interface UserDetailsType {
//   admin: boolean;
//   userId: string;
//   likes?: number[];
//   rates?: {
//     movieId: number;
//     rate: number;
//   }[];
//   comments?: {
//     id: string;
//     movieId: number;
//     text: string;
//   }[];
// }

const addComments = async (userId: string, movie: Movie, text: string, id: string) => {
  try{
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const userDetailsData = userDetails.data();

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

    return userDetails.data();
  }catch (error) {
    console.log(error);
  }
}

const removeComments = async (userId: string, id: string) => {
  try{
    const userDetails = await getUserDetails(userId);
    if (!userDetails) return;

    const userDetailsId = userDetails.id;
    const userDetailsData = userDetails.data();

    await updateDoc(doc(db, "userDetails", userDetailsId), {
      ...userDetailsData,
      comments: userDetailsData.comments.filter((comment: any) => comment.id !== id)
    });

    return userDetails.data();
  }catch (error) {
    console.log(error);
  }
}


const UserDetailsService: UserDetailsServiceType = {
  createUserdetailsColection,
  getUserDetails,
  updateUserDetails,
  toggleLikeMovie,
  toggleIsAdmin,
  addComments,
  removeComments
};

export default UserDetailsService;
