import { addDoc, collection, getDocs } from "firebase/firestore";
import PopularMovies from "../components/PopularMovies/PopularMovies";
import { AuthContext } from "../context/AuthContext";
import UserDetailsService from "../services/userdetails.service";
import "./home.scss";
import { useContext } from "react";
import { db } from "../services/firebase.service";

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

  const fetchData3 = async () => {
    try {
      const colecti = collection(db, "test");

      console.log(colecti);

      console.log("here");

      //get colection docs
      const resp2 = await getDocs(colecti);
      console.log(resp2);

      const resp = await addDoc(colecti, {
        test: "ok test",
      });
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home">
      <p>Home page</p>
      {/* <button
        onClick={() => {
          fetchData();
        }}
      >
        get
      </button> */}
      <button
        onClick={() => {
          fetchData2();
        }}
      >
        set
      </button>
      <button
        onClick={() => {
          fetchData3();
        }}
      >
        test
      </button>

      <PopularMovies />
    </div>
  );
};

export default Home;
