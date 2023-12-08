import "./profile.scss";
import { LOGOUT, UPDATE_USER_INFOS } from "../reducer/AuthReducer";
import { AuthContext } from "../context/AuthContext";
import UserDetailsService from "../services/userdetails.service";
import { useContext, useEffect, useState } from "react";

const Profile = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state.userInfos) {
      setEmail(state.userInfos.email);
    }
  }, [state.userInfos]);

  const onSubmit = () => {
    dispatch({
      type: UPDATE_USER_INFOS,
      payload: { email, password },
    });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
  };

  const fetchData = async () => {
    const data = {
      email: email,
      password: password,
    };
    try {
      const resp = await UserDetailsService.updateUserDetails(
        state.userInfos.uid,
        data
      );
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
      <button
        onClick={() => {
          fetchData();
        }}
      >
        get
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
