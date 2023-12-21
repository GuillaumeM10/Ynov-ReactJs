import { createContext, useReducer } from "react";
import { authReducer, initState } from "../reducer/AuthReducer";

interface AuthProviderProps {
  children: React.ReactNode;
}

const defaultValueType = {
  state: initState,
  dispatch: () => null,
};

export type AuthContextType = {
  state: typeof defaultValueType.state;
  dispatch: React.Dispatch<any>;
};

const AuthContext = createContext<AuthContextType>(defaultValueType);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
