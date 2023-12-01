import { Link } from "react-router-dom";
import "./header.scss";

const Header = () => {
  return (
    <header>
      <Link to="/" className={window.location.pathname === "/" ? "active" : ""}>
        Accueil
      </Link>
      <Link
        to="/authentification"
        className={
          window.location.pathname === "/authentification" ? "active" : ""
        }
      >
        Connexion / Inscription
      </Link>
    </header>
  );
};

export default Header;
