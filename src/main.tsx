import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UserDetailsProvider } from "./context/UserDetailsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserDetailsProvider>
        <App />
      </UserDetailsProvider>
    </AuthProvider>
  </React.StrictMode>
);
