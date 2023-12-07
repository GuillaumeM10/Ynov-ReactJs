import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Signin from "../components/Auth/Signin";
import { LOGOUT } from "../reducer/AuthReducer";
import Signup from "../components/Auth/Signup";
import "./auth.scss";

const Auth = () => {
  const { state, dispatch } = useContext(AuthContext);

  const [tabs, setTabs] = useState<boolean>(false);
  const [slide, setSlide] = useState<boolean>(false);

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
  };

  const changeTabSlide = () => {
    setTabs(!tabs);
    setSlide(!slide);
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
          {slide ? (
            <div className="slide">
              <div className="slider">
                <div className="activeSlide active" />
              </div>
              <button onClick={changeTabSlide}>Signin</button>
              <button>Signup</button>
            </div>
          ) : (
            <div className="slide">
              <div className="slider">
                <div className="activeSlide" />
              </div>
              <button>Signin</button>
              <button onClick={changeTabSlide}>Signup</button>
            </div>
          )}
          {tabs ? <Signup setTabs={setTabs} /> : <Signin />}
        </>
      )}
    </div>
  );
};

export default Auth;
