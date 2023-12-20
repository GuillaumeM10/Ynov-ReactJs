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

export type UserDetailsServiceType = {
  createUserdetailsColection: (
    userId: string
  ) => Promise<DocumentReference<DocumentData, DocumentData> | undefined>;
  getUserDetails: (
    userId: string
  ) => Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | void>;
  getUserDetailsAllLikes: (
    userId: string
  ) => Promise<DocumentData>;
  updateUserDetails: (
    userId: string
  ) => Promise<DocumentData | void>;
  toggleLikeMovie: (userId: string, movie: Movie) => Promise<void | DocumentData>;
};

const createUserdetailsColection = async (userId: string) => {
  if (!userId) return;

  try {
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
  console.log(userId);
  const q = query(collectionUserDetails, where("userId", "==", userId));

  if (!q) return;

  try {
    const querySnapshot = await getDocs(q);
    const userDetails = querySnapshot.docs[0].data();
    console.log(userDetails);
    localStorage.setItem("userDetails", JSON.stringify(userDetails));

    return querySnapshot.docs[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserDetailsAllLikes = async (userId: string) => {
  const collectionUserDetails = collection(db, "userDetails");
  console.log(userId);
  const q = query(collectionUserDetails, where("userId", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    const userDetails = querySnapshot.docs[0].data();
    localStorage.setItem("userDetails", JSON.stringify(userDetails));

    return querySnapshot.docs[0].data();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUserDetails = async (userId: string) => {
  const userDetails = await getUserDetails(userId);
  if (!userDetails) return;

  const userDetailsId = userDetails.id;
  const isAdmin = userDetails.data().admin;

  if (!isAdmin) {
    await updateDoc(doc(db, "userDetails", userDetailsId), {
      admin: true,
    });
  } else {
    await updateDoc(doc(db, "userDetails", userDetailsId), {
      admin: false,
    });
  }

  return userDetails.data();
};

const toggleLikeMovie = async (userId: string, movie: Movie) => {
  console.log(movie.id, userId);
  const userDetails = await getUserDetails(userId);
  if (!userDetails) return;

  const userDetailsId = userDetails.id;
  const likedMovies = userDetails.data().likes;

  if (!likedMovies) {
    await updateDoc(doc(db, "userDetails", userDetailsId), {
      likes: [movie.id],
    });
    return;
  }

  //variant of includes
  let isLiked = false;
  for (let i = 0; i < likedMovies?.length; i++) {
    if (likedMovies[i] === movie.id) {
      isLiked = true;
      break;
    }
  }
  console.log(isLiked);
  if (isLiked) {
    await updateDoc(doc(db, "userDetails", userDetailsId), {
      likes: likedMovies.filter((id: number) => id !== movie.id),
    });
  } else {
    console.log("likedMovies", likedMovies);
    console.log("movie.id", movie.id);
    await updateDoc(doc(db, "userDetails", userDetailsId), {
      likes: [...likedMovies, movie.id],
    });
  }

  return userDetails.data();
};

const UserDetailsService: UserDetailsServiceType = {
  createUserdetailsColection,
  getUserDetails,
  getUserDetailsAllLikes,
  updateUserDetails,
  toggleLikeMovie,
};

export default UserDetailsService;
