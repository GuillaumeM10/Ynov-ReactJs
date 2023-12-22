import { useState } from "react";
import UserComments from "./UserComments";

const Admin = () => {
  const [tab, setTab] = useState<string>("comments");

  return (
    <div className='admin-panel'>
      <h2>Administration</h2>
      
      <div className="tabs-container">
        <div className="tabs-buttons">

          <button
            className={tab === "comments" ? "active" : ""}
            onClick={() => setTab("comments")}
          >
            Commentaires
          </button>

        </div>
        
        {tab === "comments" && <UserComments adminPanel={true} />}
      </div>
    </div>
  );
};

export default Admin;