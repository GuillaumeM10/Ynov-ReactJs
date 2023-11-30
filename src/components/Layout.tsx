import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Layout = ({ children }: any) => {
  const [page, setPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    let path: string = location.pathname.split("/").join(" ");
    setPage(path);
  }, [location]);

  return (
    <div className={`mainLayout ${location.pathname === "/" ? "home" : page}`}>
      {/* <Navbar /> */}
      <header>
        <Link to="/">header</Link>
      </header>
      <div className="defaultPaddingX defaultPaddingY">{children}</div>
      <footer>footer</footer>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
