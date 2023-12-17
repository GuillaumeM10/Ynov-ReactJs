import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Movie from "../Pages/Movie";
import NotFound from "../Pages/NotFound";
import Auth from "../Pages/Auth";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../Pages/Profile";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="film/:id" element={<Movie />} />
      <Route
        path="/authentification"
        element={
          <ProtectedRoute to="/" bool={true}>
            <Auth />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute to="/" bool={false}>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
