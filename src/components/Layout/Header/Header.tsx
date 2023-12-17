import { Link } from "react-router-dom";
import "./header.scss";
import Search from "../../Search/Search";
import { useState, useEffect, useContext } from "react";
import Logo from "../../../assets/logo.svg";
import { AuthContext } from "../../../context/AuthContext";
import pp from "../../../assets/pp.webp";

const Header = () => {
  const [burgerActive, setBurgerActive] = useState<boolean>(false);

  const { state } = useContext(AuthContext);

  useEffect(() => {
    setBurgerActive(false);
  }, []);

  return (
    <header>
      <Link to="/" className="logo" onClick={() => setBurgerActive(false)}>
        <img width="50" src={Logo} alt="" />
      </Link>

      <Search burgerActive={burgerActive} />

      <div className={`bg menu-container${burgerActive ? " active" : ""}`}>
        <Link
          to="/"
          className={window.location.pathname === "/" ? "active primary" : "primary"}
        >
          Accueil
        </Link>

        {state.isLogged ? (
          <>
            <Link
              to="/profile"
              className={window.location.pathname === "/profile" ? "active primary" : "primary"}
              onClick={() => setBurgerActive(false)}
            >
              Profil
            </Link>
            <Link
              to="/profile"
              onClick={() => setBurgerActive(false)}
              className="profilePic"
            >
              <img width={40} height={40} className="photoURL" src={state.userInfos?.photoURL ? state.userInfos?.photoURL : pp} alt="" />
            </Link>
          </>
        ) : (
          <Link
            to="/authentification"
            className={
              window.location.pathname === "/authentification" ? "active primary" : "primary"
            }
            onClick={() => setBurgerActive(false)}
          >
            Connexion / Inscription
          </Link>
        )}
      </div>

      <button
        type="button"
        className={`burger ${burgerActive ? "active" : ""}`}
        onClick={() => {
          const oldBurgerActive = burgerActive;
          setBurgerActive(!oldBurgerActive);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};

export default Header;
