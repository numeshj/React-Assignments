import BackToHome from "../component/BackToHome";
import "../assignments/AGS_16.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoginScreen from "../component/LoginScreen";
import ProfileScreen from "../component/ProfileScreen";
import Swal from "sweetalert2";

export default function ASG_16() {
  const [user, setUser] = useState(null);
  const [logged, setLogged] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      axios
        .get("https://auth.dnjs.lk/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          setSuccess("You are already logged in.");
          setLogged(true);
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          setUser(null);
          setSuccess("");
          setLogged(false);
        });
    } else {
      setLogged(false);
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const getStoredToken = () => {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  };

  // Called by LoginScreen on successful login
  const handleLoginSuccess = (user, token, keepLoggedIn) => {
    if (keepLoggedIn) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }
    setUser(user);
    setLogged(true);
    setSuccess("You have logged in!");
  };

  // Called by ProfileScreen or LoginScreen on logout
  const handleLogout = () => {
    const token = getStoredToken();
    if (!token) {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      setUser(null);
      setSuccess("You are logged out.");
      setLogged(false);
      return;
    }
    axios
      .post(
        "https://auth.dnjs.lk/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        setUser(null);
        setSuccess("You are logged out.");
        setLogged(false);
      })
      .catch(() => {
        setUser(null);
        setSuccess("You are logged out.");
        setLogged(false);
      });
  };

  // Called by ProfileScreen after profile update
  const handleUserUpdate = (newUser) => {
    setUser(newUser);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment - 16</h1>
      <hr />
      <br />
      <div className="asg10-login-container">
        {!logged ? (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            success={success}
          />
        ) : user ? (
          <ProfileScreen
            user={user}
            onLogout={handleLogout}
            onUserUpdate={handleUserUpdate}
          />
        ) : null}
      </div>
    </>
  );
}
