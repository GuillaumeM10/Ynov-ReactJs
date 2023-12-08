import {
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase.service";

export type UserDetailsServiceType = {
  createUserdetailsColection: (
    userId: string
  ) => Promise<DocumentReference<DocumentData, DocumentData> | undefined>;
  getUserDetails: (
    userId: string
  ) => Promise<QuerySnapshot<DocumentData, DocumentData>>;
  updateUserDetails: (
    userId: string,
    data: DocumentData
  ) => Promise<QuerySnapshot<DocumentData, DocumentData> | undefined>;
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
    console.log(error);
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

const updateUserDetails = async (userId: string, data: DocumentData) => {
  const collectionUserDetails = collection(db, "userDetails");
  const q = query(collectionUserDetails, where("userId", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    console.log("querySnapshot", querySnapshot);
    if (querySnapshot.empty) return;

    const doc = querySnapshot.docs[0];
    console.log("doc", doc.ref);
    const update = await updateDoc(doc.ref, data);
    console.log("updateUserDetails", update);
    return update;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const UserDetailsService: UserDetailsServiceType = {
  createUserdetailsColection,
  getUserDetails,
  updateUserDetails,
};

export default UserDetailsService;
