import { createContext, useEffect, useReducer } from "react";
import { LOGIN, authReducer, initState } from "../reducer/AuthReducer";

interface AuthProviderProps {
  children: React.ReactNode;
}

const defaultValueType = {
  state: initState,
  dispatch: () => null,
};

const AuthContext = createContext<any>(defaultValueType);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initState);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch({ type: LOGIN, payload: JSON.parse(user) });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
