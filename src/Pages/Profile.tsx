import "./profile.scss";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import EditProfile from "../components/Profile/EditProfile";
import UserComments from "../components/Profile/UserComments";
import Admin from "../components/Profile/Admin";
import UserDetailsService from "../services/userdetails.service";
import UserRates from "../components/Profile/UserRates";

const Profile = () => {
  const { dispatch, state } = useContext(AuthContext);
  const [tab, setTab] = useState<string>("edit");

  const updateUserDetails = async () => {
    try {
      if(!state.userInfos?.uid) return;
      const userDetails = await UserDetailsService.getUserDetails(state.userInfos?.uid);
      
      if(!userDetails) return;
      const userDetailsData = userDetails.data();

      dispatch({
        type: "UPDATE_USER_INFOS",
        payload: {
          userInfos: {
            ...state.userInfos,
          },
          userDetails: {
            ...userDetailsData
          }
        }
      });

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    updateUserDetails();
  }, [])

  return (
    <div className="profile">
      <h1>
        Bonjour{" "}
        {state.userInfos?.displayName
          ? state.userInfos.displayName
          : state.userInfos?.email}
      </h1>

      <div className="tabs-container">
        <div className="tabs-buttons">
          <button
            className={tab === "edit" ? "active" : ""}
            onClick={() => setTab("edit")}
          >
            Mes informations
          </button>

          <button
            className={tab === "comments" ? "active" : ""}
            onClick={() => setTab("comments")}
          >
            Mes commentaires
          </button>

          <button
            className={tab === "rates" ? "active" : ""}
            onClick={() => setTab("rates")}
          >
            Mes notes
          </button>

          {state.userDetails?.admin && (
            <button
            className={tab === "admin" ? "active" : ""}
            onClick={() => setTab("admin")}
            >
              Administration
            </button>
          )}
          
        </div>
        
        {tab === "comments" && <UserComments />}
        {tab === "rates" && <UserRates />}
        {tab === "edit" && <EditProfile />}
        {tab === "admin" && state.userDetails?.admin && <Admin />}
      </div>
    </div>
  );
};

export default Profile;
