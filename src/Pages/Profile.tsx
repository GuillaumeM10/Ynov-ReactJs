import "./profile.scss";
import { LOGOUT, UPDATE_USER_INFOS } from "../reducer/AuthReducer";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import UserDetailsService from "../services/userdetails.service";

const Profile = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({
    success: false,
    text: "",
  });

  useEffect(() => {
    if (state.userInfos?.email) {
      setEmail(state.userInfos.email);
    }
    if (state.userInfos?.displayName) {
      setDisplayName(state.userInfos.displayName);
    }

    if (state.userInfos?.photoURL) {
      setPhotoURL(state.userInfos.photoURL);
    }

    if (state.userDetails?.admin) {
      setAdmin(state.userDetails.admin);
    }

  }, [state.userInfos, state.userDetails]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({
      type: UPDATE_USER_INFOS,
      payload: {
        userInfos : {
          ...state.userInfos,
          email,
          password,
          displayName,
          photoURL,
        },
        userDetails: {
          ...state.userDetails,
          admin: admin,
        }
      },
    });

    try {
      if(!state.userInfos?.uid) return;
      const resp = await AuthService.updateUser(state.userInfos.uid, {
        email,
        password,
        displayName,
        photoURL,
      });
      await UserDetailsService.toggleIsAdmin(state.userInfos.uid, admin)
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
    localStorage.removeItem("userDetails");
  };

  const verifyUser = async () => {
    try {
      const resp = await AuthService.verifyUser();
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
  };

  return (
    <div className="profile">
      <h1>
        Bonjour{" "}
        {state.userInfos?.displayName
          ? state.userInfos.displayName
          : state.userInfos?.email}
      </h1>
      {!state.userInfos?.emailVerified && (
        <div className="send-verification-mail">
          <p>
            Envoyer un mail de vérification{" "}
            <small>
              <b>
                (une fois le mail confirmer déconnectez vous et reconnectez
                vous)
              </b>
            </small>
          </p>
          <button
            onClick={() => {
              verifyUser();
            }}
            className="secondary"
          >
            Envoyer
          </button>
        </div>
      )}
      <form
        onSubmit={(e) => {
          if (state.userInfos?.emailVerified) onSubmit(e);
        }}
      >
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="email"
            autoComplete="email"
            disabled={!state.userInfos?.emailVerified}
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
            disabled={!state.userInfos?.emailVerified}
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
            disabled={!state.userInfos?.emailVerified}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="field">
          {photoURL && (
            <img src={photoURL} alt="" className="photoURL" width={50} height={50} />
          )}
          <label>Photo de profil</label>

          <input
            type="text"
            value={photoURL}
            placeholder="Photo de profil"
            autoComplete="photoURL"
            disabled={!state.userInfos?.emailVerified}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
        </div>

        <div className="field field-checkbox">
          <label>Admin</label>

          <input
            type="checkbox"
            checked={admin}
            placeholder={state.userDetails?.admin
              ? "Vous êtes administrateur"
              : "Devenir administrateur"}
            autoComplete="isAdmin"
            disabled={!state.userInfos?.emailVerified}
            onChange={(e) => setAdmin(e.target.checked)}
          />
        </div>

        {message.text && (
          <p
            className={`message ${message.success ? "success" : "error"}`}
            style={{ color: message.success ? "green" : "red" }}
          >
            {message.text}
          </p>
        )}

        <button
          className="submit"
          type="submit"
          disabled={!state.userInfos?.emailVerified}
        >
          Valider
        </button>

        {!state.userInfos?.emailVerified && (
          <p style={{ color: "red" }}>
            Vous ne pouvez modifier votre profil qu'après avoir vérifier votre
            mail.
          </p>
        )}
      </form>

      <button className="primary primary-red" onClick={logout}>
        Déconnexion
      </button>
      
    </div>
  );
};

export default Profile;
