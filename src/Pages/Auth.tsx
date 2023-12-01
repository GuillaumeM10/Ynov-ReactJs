import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Signin from "../components/Auth/Signin";
import { LOGOUT } from "../reducer/AuthReducer";
import Signup from "../components/Auth/Signup";

const Auth = () => {
  const { state, dispatch } = useContext(AuthContext);

  const [tabs, setTabs] = useState<boolean>(false);

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
  };

  return (
    <div>
      {state.isLogged ? (
        <div>
          <h1>Logged in as {state.userInfos.email}</h1>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <>
          {tabs ? (
            <div>
              <Signup setTabs={setTabs} />
              <button onClick={() => setTabs(false)}>Signin</button>
            </div>
          ) : (
            <div>
              <Signin />
              <button onClick={() => setTabs(true)}>Signup</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Auth;
