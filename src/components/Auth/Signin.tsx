import { FormEvent, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../services/firebase.service";
import { LOGIN } from "../../reducer/AuthReducer";
import { toast } from "react-hot-toast";
import AuthService from "../../services/auth.service";

const Signin = () => {
  const { dispatch } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userResponse = await signInWithEmailAndPassword(
        auth, // Pass the auth property of the auth object
        email,
        password
      );
      if (userResponse.user) {

        const profile = await AuthService.getAuthUser()
        setTimeout(() => {
          dispatch({ 
            type: LOGIN, 
            payload: {
              ...profile, 
              ...userResponse.user
            } 
          });
          localStorage.setItem("user", JSON.stringify(userResponse.user));
          
          toast.success("Connexion réussie");
          setLoading(false);
          navigate(state?.from ? state.from : "/");
        }, 2000);

      }
    } catch (error: any) {

      const errorCode: string = error.code;
      if (errorCode === "auth/wrong-password") {
        setError("Le mot de passe est invalide");
        toast.error("Le mot de passe est invalide");
      } else if (errorCode === "auth/user-not-found") {
        setError("L'email est invalide");
        toast.error("L'email est invalide");
      } else {
        setError("Une erreur est survenue");
        toast.error("Une erreur est survenue");
      }

      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => onSubmit(e)} className="form">
      <h1>Connexion</h1>

      {loading ? <p>Connexion en cours...</p> : (
        <>
          <div className="input">
            <label>Email :</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              />
          </div>

          <div className="input">
            <label>Password :</label>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            onClick={() => onSubmit(undefined)}
            disabled={email === "" || password === ""}
            >
            se connecter
          </button>
        </>
      )}
    </form>
  );
};

export default Signin;
