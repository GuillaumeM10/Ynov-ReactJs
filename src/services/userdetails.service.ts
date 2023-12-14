import {
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase.service";

export type UserDetailsServiceType = {
  createUserdetailsColection: (
    userId: string
  ) => Promise<DocumentReference<DocumentData, DocumentData> | undefined>;
  getUserDetails: (
    userId: string
  ) => Promise<QuerySnapshot<DocumentData, DocumentData>>;
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
    return querySnapshot;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const UserDetailsService: UserDetailsServiceType = {
  createUserdetailsColection,
  getUserDetails,
};

export default UserDetailsService;
