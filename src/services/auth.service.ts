import { Unsubscribe, User, onAuthStateChanged, sendEmailVerification, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase.service";

export type AuthServiceType = {
  getAuthUser: () => Promise<User | null>;
  updateUser: (
    userId: string,
    data: UserService
  ) => Promise<string>;
  verifyUser: () => Promise<string>;
  resetPassword: () => Promise<string | null | undefined>;
};

const getAuthUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Unsubscribe once the callback is triggered

      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

const updateUser = async (userId: string, data: UserService) => {
  try{
    const user = await getAuthUser();
  
    if (user) {
      const uid = user.uid;

      if(
          uid === userId && 
          auth.currentUser
        ){
          await updateProfile(auth.currentUser, {
            displayName: data.displayName,
            photoURL: data.photoURL
          });

          if(data.email) {
            await updateEmail(auth.currentUser, data.email);
          }

          if(data.password) {
            await updatePassword(auth.currentUser, data.password);
          }

          return "Action réussie."
      }else{
        throw "Action non autorisée."
      }
      // ...
    } else {
      throw "Aucun utilisateur connecté";
    }
  }catch(err: any){
    console.log(err)
    const errorCode = err.code;

    if(errorCode === "auth/requires-recent-login"){
      throw "Vous devez vous reconnecter pour effectuer cette action."
    }else if(errorCode === "auth/operation-not-allowed"){
      throw "Veillez vérifier votre mail avant de le changer."
    }else{
      throw "Une erreur est survenue."
    } 
  }
};

const verifyUser = async () => {
  try{
    const user = await getAuthUser();

    if(user){
      await sendEmailVerification(user)
      return "Email de verification envoyé."
    }else{
      throw "Aucun utilisateur connecté";
    }
  }catch(err){
    console.log(err)
    throw "Une erreur est survenue"
  }
}

const resetPassword = async () => {
  try{
    const user = await getAuthUser();

    if(user){
      await sendEmailVerification(user)
      return "Email de changement de mot de passe envoyé."
    }else{
      throw "Aucun utilisateur connecté";
    }
  }catch(err){
    console.log(err)
    throw err
  }
}

const AuthService: AuthServiceType = {
  getAuthUser,
  updateUser,
  verifyUser,
  resetPassword
};

export default AuthService;
