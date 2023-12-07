import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Signin from "../components/Auth/Signin";
import { LOGOUT, UPDATE_USER_INFOS } from "../reducer/AuthReducer";
import Signup from "../components/Auth/Signup";

const Auth = () => {
  const { state, dispatch } = useContext(AuthContext);

  const [tabs, setTabs] = useState<boolean>(false);

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

  return (
    <div>
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
