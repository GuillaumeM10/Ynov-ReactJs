import "./profile.scss";
import { LOGOUT, UPDATE_USER_INFOS } from "../reducer/AuthReducer";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import AuthService from "../services/auth.service";

const Profile = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");
  const [message, setMessage] = useState<Message>({
    success: false,
    text: "",
  });

  useEffect(() => {
    if (state.userInfos) {
      setEmail(state.userInfos.email);
    }
    if (state.userInfos.displayName) {
      setDisplayName(state.userInfos.displayName);
    }

    if (state.userInfos.photoURL) {
      setPhotoURL(state.userInfos.photoURL);
    }

    console.log(state.userInfos);
    
    
  }, [state.userInfos]);

  const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({
      type: UPDATE_USER_INFOS,
      payload: { 
        ...state.userInfos, 
        email, 
        password, 
        displayName, 
        photoURL
      },
    });

    try {
      const resp = await AuthService.updateUser(
        state.userInfos.uid,
        { 
          email, 
          password, 
          displayName, 
          photoURL
        }
      );
      setMessage({
        success: true,
        text: resp,
      });
    } catch (err) {
      setMessage({
        success: false,
        text: err as string,
      });
    }
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
  };

  const verifyUser = async () => {
    try {
      const resp = await AuthService.verifyUser();
      console.log(resp);
      setMessage({
        success: true,
        text: resp,
      });
    } catch (error) {
      console.log(error);
      setMessage({
        success: false,
        text: error as string,
      });
    }
  }

  const fetchData = async () => {
    try {
      const resp = await AuthService.getAuthUser();
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile">
      <h1>Bonjour {state.userInfos.email}</h1>
      {!state.userInfos.emailVerified && (

        <button
        onClick={() => {
          verifyUser();
        }}
        >
          Envoyer un mail de vérification
        </button>
      )}
      <form onSubmit={(e) => {if(state.userInfos.emailVerified) onSubmit(e)}}>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="email"
            autoComplete="email"
            disabled={!state.userInfos.emailVerified}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>


        <div className="field">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            placeholder="********"
            autoComplete="current-password"
            disabled={!state.userInfos.emailVerified}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Pseudonyme</label>

          <input
            type="text"
            value={displayName}
            placeholder="Pseudonyme"
            autoComplete="displayName"
            disabled={!state.userInfos.emailVerified}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="field">
          {photoURL && (
            <img src={photoURL} alt="" className="photoURL" width={50}/>
          )}
          <label>Photo de profil</label>

          <input
            type="text"
            value={photoURL}
            placeholder="Photo de profil"
            autoComplete="photoURL"
            disabled={!state.userInfos.emailVerified}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
        </div>

        {message.text && (
          <p className={`message ${message.success ? "success" : "error"}`} style={{ color: message.success ? "green" : "red" }}>
            {message.text}
          </p>
        )}

        <button 
          className="submit" 
          type="submit"
          disabled={!state.userInfos.emailVerified}
        >
          Valider
        </button>

        {!state.userInfos.emailVerified && (
          <p style={{ color: "red" }}>Veuillez vérifier votre adresse mail</p>
        )}
      </form>

      <button
        onClick={() => {
          fetchData();
        }}
      >
        get
      </button>

      <button className="primary primary-red" onClick={logout}>Déconnexion</button>
    </div>
  );
};

export default Profile;
