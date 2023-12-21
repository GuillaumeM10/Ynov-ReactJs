import { useState } from "react";
import { auth } from "../../services/firebase.service";
import { createUserWithEmailAndPassword } from "firebase/auth";
import UserDetailsService from "../../services/userdetails.service";
import { toast } from "react-hot-toast/headless";

export type signupPropsType = {
  setTabs: React.Dispatch<React.SetStateAction<boolean>>;
};

const Signup = ({ setTabs }: signupPropsType) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await UserDetailsService.createUserdetailsColection(newUser.user.uid);

      if (newUser.user) {
        toast.success("Inscription réussie");
        setLoading(false);
        setTabs(false);
      }
    } catch (error: any) {
      const errorCode: string = error.code;

      if (errorCode === "auth/weak-password") {
        setError("Le mot de passe doit faire au minimum 6 caractères");
        toast.error("Le mot de passe doit faire au minimum 6 caractères");
      } else if (errorCode === "auth/email-already-in-use") {
        setError("L'email est déjà utilisé");
        toast.error("L'email est déjà utilisé");
      } else {
        setError("Une erreur est survenue");
        toast.error("Une erreur est survenue");
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => onSubmit(e)} className="form">
      <h1>Inscription</h1>

      {loading ? (
        <p>Inscription en cours...</p>
      ) : (
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
            s'inscrire
          </button>
        </>
      )}
    </form>
  );
};

export default Signup;
