import { createContext } from "react";

const ExempleContext = createContext<any>(null);

const ExempleProvider = ({ children }: any) => {
  const testValue: string = "Exemple";

  return (
    <ExempleContext.Provider
      value={{
        testValue,
      }}
    >
      {children}
    </ExempleContext.Provider>
  );
};

export { ExempleContext, ExempleProvider };
