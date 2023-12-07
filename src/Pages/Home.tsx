import PopularMovies from "../components/PopularMovies/PopularMovies";
import { AuthContext } from "../context/AuthContext";
import UserDetailsService from "../services/userdetails.service";
import "./home.scss";
import { useContext } from "react";

const Home = () => {
  const {
    state: { userInfos },
  } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const resp = await UserDetailsService.getUserDetails(userInfos.uid);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData2 = async () => {
    try {
      const resp = await UserDetailsService.createUserdetailsColection(
        userInfos.uid
      );
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home">
      <p>Home page</p>
      <button
        onClick={() => {
          fetchData();
        }}
      >
        get
      </button>
      <br />
      <button
        onClick={() => {
          fetchData2();
        }}
      >
        set
      </button>

      <PopularMovies />
    </div>
  );
};

export default Home;
