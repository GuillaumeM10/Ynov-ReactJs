import { Link } from "react-router-dom";
import "./header.scss";

const Header = () => {
  return (
    <header>
      <Link to="/">Home</Link>
    </header>
  );
};

export default Header;
