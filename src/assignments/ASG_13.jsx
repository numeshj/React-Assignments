import BackToHome from "../component/BackToHome";
import "../assignments/AGS_10.css";
import { use, useEffect, useState } from "react";
import axios from "axios";
import LoginScreen from "../component/LoginScreen";
import ProfileScreen from "../component/ProfileScreen";

export default function ASG_13() {
  const [post, setPost] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      fetchUserDetails();
      setSuccess("You are already logged in.");
    }
  }, []);

  const getStoredToken = () => {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  };

  const fetchUserDetails = () => {
    const token = getStoredToken(); // get from storage
    if (!token) return;

    axios
      .get("https://auth.dnjs.lk/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("User Data : ", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch user : ", error);
      });
  };

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    axios
      .post(
        "https://auth.dnjs.lk/api/login",
        { email: post.email, password: post.password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        const token = response.data.access_token;
        if (keepLoggedIn) {
          localStorage.setItem("authToken", token);
        } else {
          sessionStorage.setItem("authToken", token);
        }

        fetchUserDetails();
        setError("");
        setSuccess("You have logged!");
      })
      .catch((error) => {
        console.log(error);
        setSuccess("");
        setError(error.response?.data?.message || "Login failed");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setUser(null);
    setSuccess("");
    setError("");
    setPost({ email: "", password: "" });
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment - 13</h1>
      <hr />
      <br />
      <div className="asg10-login-container">
        {!user ? (
          <LoginScreen
            post={post}
            error={error}
            success={success}
            showPassword={showPassword}
            keepLoggedIn={keepLoggedIn}
            setShowPassword={setShowPassword}
            setKeepLoggedIn={setKeepLoggedIn}
            handleInput={handleInput}
            handleSubmit={handleSubmit}
          />
        ) : (
          <ProfileScreen
            user={user}
            success={success}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </>
  );
}
