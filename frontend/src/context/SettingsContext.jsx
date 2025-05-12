import { createContext, useContext, useState } from "react";
import defaultLogo from "../assets/Oglogo.png"; // ✅ use import

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [logo, setLogo] = useState(defaultLogo); // ✅ use imported logo here

  return (
    <SettingsContext.Provider value={{ logo, setLogo }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
