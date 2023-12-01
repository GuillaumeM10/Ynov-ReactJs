export const initState = {
  isLogged: false,
  isLoading: false,
  userInfos: null,
};

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SET_LOADING = "SET_LOADING";
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
    case SET_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case UPDATE_USER_INFOS:
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
