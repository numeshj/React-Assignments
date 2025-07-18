import BackToHome from "../component/BackToHome";
import "../assignments/ASG_33.css";
import { useEffect, useState } from "react";
import LoginScreen from "../component/LoginScreen";
import ProfileScreen from "../component/ProfileScreen";

import { useGetUserQuery } from "../store/api";

export default function ASG_33() {
  const [logged, setLogged] = useState(false);
  const [success, setSuccess] = useState("");

  const getStoredToken = () => {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  };

  const token = getStoredToken();

  // Call API using RTK Query hook
  const {
    data: user,
    error,
    isLoading,
  } = useGetUserQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    if (token && user) {
      setSuccess("You are already logged in.");
      setLogged(true);
    } else if (error) { 
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      setLogged(false);
    } else {
      setLogged(false);
    }
  }, [token, user, error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handle login success
  const handleLoginSuccess = (userData, token, keepLoggedIn) => {
    if (keepLoggedIn) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }
    setSuccess("You have logged in!");
    setLogged(true);
  };

  // Called by ProfileScreen after profile update
  const handleUserUpdate = (newUser) => {
    // This would typically trigger a refetch or update cache
    console.log("User updated:", newUser);
  };

  const handleLoggedOut = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setSuccess("You are logged out.");
    setLogged(false);
  };

  return (
    <>
      <BackToHome disabled={isLoading} />
      <h1 className="assignment-title">Assignment - 33</h1>
      <hr />
      <br />
      <div className="asg33-login-container">
        {!logged ? (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            success={success}
            loading={isLoading}
            disabled={isLoading}
          />
        ) : user ? (
          <ProfileScreen
            user={user}
            onUserUpdate={handleUserUpdate}
            loading={isLoading}
            disabled={isLoading}
            onLoggedOut={handleLoggedOut}
          />
        ) : null}
      </div>
    </>
  );
}
