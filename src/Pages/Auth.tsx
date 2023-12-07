import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Signin from "../components/Auth/Signin";
import { LOGOUT } from "../reducer/AuthReducer";
import Signup from "../components/Auth/Signup";
import "./auth.scss";

const Auth = () => {
  const { state, dispatch } = useContext(AuthContext);

  const [tabs, setTabs] = useState<boolean>(false);

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
  };

  return (
    <div className="auth">
      {state.isLogged ? (
        <div>
          <h1>Logged in as {state.userInfos.email}</h1>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <>
          {tabs ? (
            <>
              <Signup setTabs={setTabs} />
              <div className="slide">
                <button onClick={() => setTabs(false)}>Signin</button>
                <button className="active" onClick={() => setTabs(true)}>
                  Signup
                </button>
              </div>
            </>
          ) : (
            <>
              <Signin />
              <div className="slide">
                <button className="active" onClick={() => setTabs(false)}>
                  Signin
                </button>
                <button onClick={() => setTabs(true)}>Signup</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Auth;
