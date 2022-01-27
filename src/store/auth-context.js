import React, { useCallback, useEffect, useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  logoutTimer: null,
  login: (token) => {},
  logout: () => {},
});
let logoutTimer;

const calculateTime = (expireTime) => {
  const currentTime = new Date().getTime();
  const adjExpireTime = new Date(expireTime).getTime();
  const remainingTime = adjExpireTime - currentTime;

  return remainingTime;
};

const retrieveStoreToken = () => {
  const storeToken = localStorage.getItem("userToken");
  const storeExpireTime = localStorage.getItem("expireTime");

  const remainingTime = calculateTime(storeExpireTime);

  if (remainingTime <= 3600) {
    localStorage.removeItem("userToken");
    localStorage.removeItem("expireTime");
    return null;
  }

  return {
    token: storeToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoreToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("expireTime");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    setToken(null);
  },[]);

  const loginHandler = (token, expireTime) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("expireTime", expireTime);
    setToken(token);
    const remainingTime = calculateTime(expireTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    logoutTimer: logoutTimer,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
