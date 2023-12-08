import "./footer.scss";
import { Link } from "react-router-dom";
import SvgFacebook from "../../../assets/facebook.svg";
import SvgTwitter from "../../../assets/twitter.svg";
import SvgInstagram from "../../../assets/instagram.svg";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/a-propos">À propos</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cgu">CGU</Link>
          <Link to="/aide">Aide</Link>
        </div>
        <div className="footer-social">
          <a
            href="https://www.facebook.com/bonjourlechat/?locale=fr_FR"
            target="_blank"
          >
            <img src={SvgFacebook} alt="" />
          </a>
          <a href="https://twitter.com/LeChat69962112" target="_blank">
            <img src={SvgTwitter} alt="" />
          </a>
          <a href="https://www.instagram.com/benbencatcat/" target="_blank">
            <img src={SvgInstagram} alt="" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2023 - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
