import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Signin from "../components/Auth/Signin";
import { LOGOUT, UPDATE_USER_INFOS } from "../reducer/AuthReducer";
import Signup from "../components/Auth/Signup";
import "./auth.scss";

const Auth = () => {
  const { state, dispatch } = useContext(AuthContext);

  const [tabs, setTabs] = useState<boolean>(false);
  const [slide, setSlide] = useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state.userInfos) {
      setEmail(state.userInfos.email);
    }
  }, [state.userInfos]);

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
  };

  const onSubmit = () => {
    dispatch({
      type: UPDATE_USER_INFOS,
      payload: { email, password },
    });
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
          <form onSubmit={onSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Update</button>
          </form>
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
