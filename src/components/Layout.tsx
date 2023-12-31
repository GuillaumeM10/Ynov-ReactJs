import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Layout/Header/Header";
import Footer from "./Layout/Footer/Footer";
import Breadcrumb from "./Layout/Breadcrumb/Breadcrumb";
import { Toaster } from "react-hot-toast";

export type LayoutPropsType = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutPropsType) => {
  const [page, setPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    let path: string = location.pathname.split("/").join(" ");
    setPage(path);
  }, [location]);

  return (
    <div className={`mainLayout ${location.pathname === "/" ? "home" : page}`}>
      <Header />
      <main>
        <Breadcrumb />

        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
