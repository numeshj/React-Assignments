import BackToHome from "../component/BackToHome";
import "../assignments/AGS_10.css";
import { use, useEffect, useState } from "react";
import axios from "axios";
import LoginScreen from "../component/LoginScreen";
import ProfileScreen from "../component/ProfileScreen";
import Swal from "sweetalert2";

export default function ASG_16() {
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
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploadMessage, setAvatarUploadMesssage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleAvatarUpload = () => {
    setAvatarUploadMesssage("");

    if (!avatarFile) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select an image file.",
        showConfirmButton: true,
      });
      return;
    }

    const token = getStoredToken();
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    axios
      .post("https://auth.dnjs.lk/api/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Profile Picture Uploaded",
          text: "Profile picture uploaded successfully.",
          showConfirmButton: true,
        });
        setAvatarUploadMesssage("");
        setAvatarFile(null);
        fetchUserDetails();
      })
      .catch((error) => {
        console.error("Avatar upload failed : ", error);
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Failed to upload avatar.",
          showConfirmButton: true,
        });
        setAvatarUploadMesssage("Failed to upload avatar.");
      });
  };

  const validatePassword = (password) => {
    const specialCharRegex = /[\*\/@#$\-]/;
    const numberRegex = /[0-9]/;
    const lowerRegex = /[a-z]/;
    const upperRegex = /[A-Z]/;
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (password.length > 40)
      return "Password must not exceed 40 characters.";
    if (!numberRegex.test(password))
      return "Password must contain at least one numeric character.";
    if (!specialCharRegex.test(password))
      return "Password must contain at least one special character (*/-@#$).";
    if (!lowerRegex.test(password))
      return "Password must contain at least one lowercase letter.";
    if (!upperRegex.test(password))
      return "Password must contain at least one uppercase letter.";
    return null;
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !verifyPassword) {
      setPasswordError("All password fields are required.");
      return;
    }
    if (newPassword !== verifyPassword) {
      setPasswordError("New password and re-entered password do not match.");
      return;
    }
    const validationMsg = validatePassword(newPassword);
    if (validationMsg) {
      setPasswordError(validationMsg);
      return;
    }
    try {
      const token = getStoredToken();
      await axios.put(
        "https://auth.dnjs.lk/api/password",
        {
          old_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: verifyPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Your password has been changed successfully!",
        showConfirmButton: true,
      });
      setCurrentPassword("");
      setNewPassword("");
      setVerifyPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    }
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
            avatarFile={avatarFile}
            setAvatarFile={setAvatarFile}
            handleAvatarUpload={handleAvatarUpload}
            avatarUploadMessage={avatarUploadMessage}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            verifyPassword={verifyPassword}
            setVerifyPassword={setVerifyPassword}
            passwordError={passwordError}
            handleChangePassword={handleChangePassword}
          />
        ) : null}
      </div>
    </>
  );
}
