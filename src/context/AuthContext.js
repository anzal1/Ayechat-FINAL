import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { fb } from "service";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userObject, setUserObject] = useState({});
  const [convertedName, setConvertedName] = useState();
  const history = useHistory();

  function lowerLetters(str) {
    return str.toLowerCase();
  }

  useEffect(() => {
    fb.auth.onAuthStateChanged((user) => {
      if (user && user.displayName == null) {
        //When logging with custom account
        setUserObject(user);
        setConvertedName(
          lowerLetters(user.email.substring(0, user.email.lastIndexOf("@")))
        );
        setLoading(false);
        history.push("/");
      } else if (user && user.displayName !== null) {
        //When logging with gmail/fb account
        setUserObject(user);
        setConvertedName(encodeURIComponent(lowerLetters(user.displayName)));
        setLoading(false);
        history.push("/");
      } else {
        setUserObject(null);
        history.push("/");
        setLoading(false);
      }
    });
  }, [history]);

  const value = { userObject, convertedName };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
