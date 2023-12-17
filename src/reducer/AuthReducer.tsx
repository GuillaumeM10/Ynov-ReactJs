import { User } from "firebase/auth";

let user: User | null = JSON.parse(localStorage.getItem("user") as string);

export const initState = {
  isLogged: user?.uid ? true : false,
  isLoading: false,
  userInfos: user?.uid ? user : null,
};

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const UPDATE_USER_INFOS = "UPDATE_USER_INFOS";

export const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLogged: true,
        isLoading: false,
        userInfos: action.payload,
      };
    case UPDATE_USER_INFOS:
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        isLoading: false,
        userInfos: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isLogged: false,
        userInfos: initState.userInfos,
      };
    default:
      return initState;
  }
};
