import BackToHome from "../component/BackToHome";
import "../assignments/AGS_10.css";
import { use, useEffect, useState } from "react";
import axios from "axios";
import LoginScreen from "../component/LoginScreen";
import ProfileScreen from "../component/ProfileScreen";
import Swal from "sweetalert2";

export default function ASG_14() {
  const [post, setPost] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [logged, setLogged] = useState(false);

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
        .catch((error) => {
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

  const fetchUserDetails = () => {
    const token = getStoredToken();
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

        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        setUser(null);
        setSuccess("");
      });
  };

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
    setError("");
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
        console.log("Login response data:", response.data);
        const token = response.data.access_token;
        if (keepLoggedIn) {
          localStorage.setItem("authToken", token);
        } else {
          sessionStorage.setItem("authToken", token);
        }
        fetchUserDetails();
        setError("");
        setSuccess("You have logged!");
        setLogged(true);
      })
      .catch((error) => {
        console.log(error);
        setSuccess("");
        setError(error.response?.data?.message || "Login failed");
        setLogged(false);
      });
  };

  const handleLogout = () => {
    const token = getStoredToken();
    if (!token) {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      setUser(null);
      setSuccess("You are logged out.");
      setError("");
      setLogged(false);
      setPost({ email: "", password: "" });
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
      .then((response) => {
        console.log("Logged out:", response.data);
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        setUser(null);
        setSuccess("You are logged out.");
        setError("");
        setLogged(false);
        setPost({ email: "", password: "" });
      })
      .catch((error) => {
        console.error("Logout error:", error);
        setError("Logout failed. Please try again.");
        setSuccess("");
        setLogged(false);
        setPost({ email: "", password: "" });
      });
  };

  const handleProfileUpdate = (name, description) => {
    const token = getStoredToken();
    if (!token) {
      return;
    }

    axios
      .put(
        "https://auth.dnjs.lk/api/user",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Profile Updated Successfully");
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile was updated successfully!",
          showConfirmButton: true,
          timer: 5000,
        });
        setUser(response.data);
      })
      .catch((error) => {
        console.log("Update Failed", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update profile.",
          showConfirmButton: true,
        });
      });
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment - 14</h1>
      <hr />
      <br />
      <div className="asg10-login-container">
        {!logged ? (
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
            setLogged={setLogged}
          />
        ) : user ? (
          <ProfileScreen
            user={user}
            success={success}
            handleLogout={handleLogout}
            setLogged={setLogged}
            handleProfileUpdate={handleProfileUpdate}
          />
        ) : null}
      </div>
    </>
  );
}
