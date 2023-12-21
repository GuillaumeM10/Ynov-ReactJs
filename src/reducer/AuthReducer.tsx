import { User } from "firebase/auth";
import { UserDetailsType } from "../types/colections.type";

let user: User | null = JSON.parse(localStorage.getItem("user") as string);
let userDetailsStorage: UserDetailsType | null = JSON.parse(localStorage.getItem("userDetails") as string);

export const initState = {
  isLogged: user?.uid ? true : false,
  isLoading: false,
  userInfos: user?.uid ? user : null,
  userDetails: userDetailsStorage ? userDetailsStorage : null,
};

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const UPDATE_USER_INFOS = "UPDATE_USER_INFOS";

export type AuthStateType = {
  isLogged: boolean;
  isLoading: boolean;
  userInfos: User | null;
  userDetails: UserDetailsType | null;
};

export type AuthActionType = {
  type: string;
  payload: {
    userInfos: User;
    userDetails: UserDetailsType;
  };
};

export const authReducer = (state: AuthStateType, action: AuthActionType) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("user", JSON.stringify(action.payload.userInfos));
      localStorage.setItem("userDetails", JSON.stringify(action.payload.userDetails));
      return {
        ...state,
        isLogged: true,
        isLoading: false,
        userInfos: action.payload.userInfos,
        userDetails: action.payload.userDetails,
      };
    case UPDATE_USER_INFOS:
      localStorage.setItem("user", JSON.stringify(action.payload.userInfos));
      localStorage.setItem("userDetails", JSON.stringify(action.payload.userDetails));
      
      return {
        ...state,
        isLoading: false,
        userInfos: action.payload.userInfos,
        userDetails: action.payload.userDetails,
      };
    case LOGOUT:
      return {
        ...state,
        isLogged: false,
        userInfos: initState.userInfos,
        userDetails: initState.userDetails,
      };
    default:
      return initState;
  }
};
