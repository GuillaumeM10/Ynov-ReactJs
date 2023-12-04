import { Link } from "react-router-dom";
import "./header.scss";
import Search from "../../Search/Search";
import { useState, useEffect } from "react";
import Logo from "../../../assets/logo.svg";

const Header = () => {
  const [burgerActive, setBurgerActive] = useState<boolean>(false);
  
  useEffect(() => {
    setBurgerActive(false);
  }, []); 

  return (
    <header>
      <Link 
          to="/" 
          className="logo"
          onClick={() => setBurgerActive(false)}
      >
          <img width="50" src={Logo} alt="" />
      </Link>

      

      <Search  burgerActive={burgerActive} />

      <div className={`bg menu-container${burgerActive ? " active" : ""}`}>

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

      </div>

      <button 
        type='button'
        className={`burger ${burgerActive ? "active" : ""}`}
        onClick={() => {
            const oldBurgerActive = burgerActive;
            setBurgerActive(!oldBurgerActive)
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
