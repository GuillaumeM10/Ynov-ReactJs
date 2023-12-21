import { useState } from "react";
import Signin from "../components/Auth/Signin";
import Signup from "../components/Auth/Signup";
import "./auth.scss";

const Auth = () => {
  const [tabs, setTabs] = useState<boolean>(false);
  const [slide, setSlide] = useState<boolean>(false);

  const changeTabSlide = () => {
    setTabs(!tabs);
    setSlide(!slide);
  };

  return (
    <div className="auth">
      <div className="slide">
        <div className="slider">
          <div className={slide ? "activeSlide active" : "activeSlide"} />
        </div>
        <button onClick={changeTabSlide}>Connexion</button>
        <button onClick={changeTabSlide}>Inscription</button>
      </div>
      {tabs ? <Signup setTabs={setTabs} /> : <Signin />}
    </div>
  );
};

export default Auth;
