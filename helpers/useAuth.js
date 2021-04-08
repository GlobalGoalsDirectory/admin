import { createContext, useContext } from "react";

const authContext = createContext(null);

export const AuthProvider = ({ children, auth }) => (
  <authContext.Provider value={auth}>{children}</authContext.Provider>
);

const useAuth = () => {
  const auth = useContext(authContext);
  if (!auth) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return auth;
};

export default useAuth;
