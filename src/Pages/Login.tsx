import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const [userChange, setUserChange] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserChange({ ...userChange, [e.target.name]: e.target.value });
    console.log(userChange);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser(userChange);
    localStorage.setItem("user", JSON.stringify(userChange));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Logged in as {user.username}</h1>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input
            type="text"
            placeholder="username"
            name="username"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
