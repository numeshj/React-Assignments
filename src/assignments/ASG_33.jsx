import BackToHome from "../component/BackToHome";
import "../assignments/ASG_33.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginScreen from "../component/LoginScreen";
import ProfileScreen from "../component/ProfileScreen";
import { 
  setAuthState, 
  clearAuth, 
  setSuccess, 
  clearMessages,
  updateUser 
} from "../store/authSlice";
import { useGetUserQuery } from "../store/api";

export default function ASG_33() {
  const dispatch = useDispatch();
  const { isAuthenticated, success } = useSelector((state) => state.auth);

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
    refetch,
  } = useGetUserQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    if (token && user) {
      dispatch(setSuccess("You are already logged in."));
      dispatch(setAuthState({ 
        user, 
        token, 
        isAuthenticated: true 
      }));
    } else if (error) { 
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      dispatch(clearAuth());
    } else if (!token) {
      dispatch(clearAuth());
    }
  }, [token, user, error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearMessages()), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Handle login success
  const handleLoginSuccess = (userData, token, keepLoggedIn) => {
    if (keepLoggedIn) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }
    dispatch(setSuccess("You have logged in!"));
    dispatch(setAuthState({ 
      user: userData, 
      token, 
      isAuthenticated: true 
    }));
  };

  // Called by ProfileScreen after profile update
  const handleUserUpdate = (newUser) => {
    dispatch(updateUser(newUser));
    // Force refetch to get updated data
    refetch();
  };

  const handleLoggedOut = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    dispatch(setSuccess("You are logged out."));
    dispatch(clearAuth());
  };

  return (
    <>
      <BackToHome disabled={isLoading} />
      <h1 className="asg33-assignment-title">Assignment - 33</h1>
      <hr />
      <br />
      <div className="asg33-login-container">
        {!isAuthenticated ? (
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
