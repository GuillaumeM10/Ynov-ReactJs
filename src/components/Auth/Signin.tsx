import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../services/firebase.service";
import { LOGIN } from "../../reducer/AuthReducer";

const Signin = () => {
  const { dispatch } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    console.log("email", email);
    console.log("password", password);

    try {
      const userResponse = await signInWithEmailAndPassword(
        auth, // Pass the auth property of the auth object
        email,
        password
      );
      if (userResponse.user) {
        setTimeout(() => {
          dispatch({ type: LOGIN, payload: userResponse.user });
          localStorage.setItem("user", JSON.stringify(userResponse.user));
          navigate(state?.from ? state.from : "/");
        }, 2000);
      }
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === "auth/wrong-password") {
        setError("Le mot de passe est invalide");
      } else if (errorCode === "auth/user-not-found") {
        setError("L'email est invalide");
      } else {
        setError("Une erreur est survenue");
      }
    }
  };

  return (
    <div className="form">
      <h1>Login Form</h1>

      <div className="input">
        <label>Email :</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input">
        <label>Password :</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={onSubmit} disabled={email === "" || password === ""}>
        Login
      </button>
    </div>
  );
};

export default Signin;
