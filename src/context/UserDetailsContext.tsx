import { createContext, useEffect, useState } from "react";

interface UserDetailsProps {
  children: React.ReactNode;
}

const defaultValueType = {
  speudo: "anonyme",
  email: "",
  password: "",
};

const UserDetailsContext = createContext<any>(defaultValueType);

const UserDetailsProvider = ({ children }: UserDetailsProps) => {
  const [userDetail, setUserDetail] = useState(defaultValueType);

  useEffect(() => {
    const userDetailStorage = localStorage.getItem("userDetails");
    if (userDetailStorage) {
      setUserDetail(JSON.parse(userDetailStorage));
    }
  }, []);

  return (
    <UserDetailsContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export { UserDetailsContext, UserDetailsProvider };
