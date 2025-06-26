import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { getStoredToken } from "../utility/helper";
import "../assignments/AGS_10.css";

export default function ProfileScreen({
  user,
  onUserUpdate,
  loading = false,
  disabled = false,
  onLoggedOut, // <-- add this prop for parent notification
}) {
  const [mode, setMode] = useState("summary");
  const [name, setName] = useState(user.name);
  const [description, setDescription] = useState(user.description);
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [email, setEmail] = useState("");
  const [localLoading, setLocalLoading] = useState(false); // local loading for logout
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    setName(user.name);
    setDescription(user.description);
  }, [user.name, user.description]);

  // Profile update
  const handleProfileUpdate = (name, description) => {
    if (loading || disabled) return;
    const token = getStoredToken();
    if (!token) return;
    axios
      .put(
        "https://auth.dnjs.lk/api/user",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile was updated successfully!",
          showConfirmButton: true,
          timer: 5000,
        });
        onUserUpdate(response.data);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update profile.",
          showConfirmButton: true,
        });
      });
  };

  // Avatar upload
  const handleAvatarUpload = () => {
    if (loading || disabled) return;
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
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Profile Picture Uploaded",
          text: "Profile picture uploaded successfully.",
          showConfirmButton: true,
        });
        setAvatarFile(null);
        onUserUpdate(response.data);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Failed to upload avatar.",
          showConfirmButton: true,
        });
      });
  };

  // Avatar remove
  const handleAvatarRemove = () => {
    if (loading || disabled) return;
    const token = getStoredToken();
    if (!token) return;
    Swal.fire({
      title: "Remove Profile Picture?",
      text: "Are you sure you want to remove your profile picture?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d50000",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("https://auth.dnjs.lk/api/avatar", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "Removed!",
              "Your profile picture has been removed.",
              "success"
            );
            onUserUpdate(response.data);
          })
          .catch(() => {
            Swal.fire("Failed", "Failed to remove profile picture.", "error");
          });
      }
    });
  };

  // Password validation
  const validatePassword = (password) => {
    const specialCharRegex = /[\*\/@#$\-]/;
    const numberRegex = /[0-9]/;
    const lowerRegex = /[a-z]/;
    const upperRegex = /[A-Z]/;
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (password.length > 40) return "Password must not exceed 40 characters.";
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

  // Change password
  const handleChangePassword = async () => {
    if (loading || disabled) return;

    // Basic checks
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    const validationMsg = validatePassword(passwords.new);
    if (validationMsg) {
      setPasswordError(validationMsg);
      return;
    }

    try {
      const token = getStoredToken();
      await axios.put(
        "https://auth.dnjs.lk/api/password",
        {
          old_password: passwords.current,
          new_password: passwords.new,
          new_password_confirmation: passwords.confirm,
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
        text: "Your password was changed successfully!",
      });

      setPasswords({ current: "", new: "", confirm: "" });
      setPasswordError("");
    } catch (err) {
      const res = err?.response?.data;

      let message = "Failed to change password.";
      if (res?.errors?.old_password) {
        message = res.errors.old_password[0];
      } else if (res?.message) {
        message = res.message;
      }

      setPasswordError(message);

      Swal.fire({
        icon: "error",
        title: "Change Password Failed",
        text: message,
      });
    }
  };

  // Logout logic (self-contained)
  const handleLogout = () => {
    if (loading || disabled || localLoading) return;
    setLocalLoading(true);
    const token = getStoredToken();
    if (!token) {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      if (onLoggedOut) onLoggedOut();
      setLocalLoading(false);
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
        if (onLoggedOut) onLoggedOut();
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        if (onLoggedOut) onLoggedOut();
      })
      .finally(() => setLocalLoading(false));
  };

  // Change email
  const handleEmailChange = async () => {
    if (loading || disabled) return;
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "No Email Entered",
        text: "Please enter a new email address.",
        showConfirmButton: true,
      });
      return;
    }
    const token = getStoredToken();
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Not Authenticated",
        text: "You are not logged in. Please log in again.",
        showConfirmButton: true,
      });
      return;
    }
    try {
      await axios.post(
        `https://auth.dnjs.lk/api/email?token=${token}`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Verification Sent",
        text: "A verification link has been sent to your new email.",
        showConfirmButton: true,
      });
      setEmail("");
      setMode("summary");
    } catch (err) {
      const res = err?.response?.data;
      let message = "Failed to change the email.";

      if (res?.error?.message) {
        message = res.error.message;
      }

      setEmailError(message);

      Swal.fire({
        icon: "error",
        title: "Change email failed",
        text: message,
      });
    }
  };

  // Navigation helpers
  const handleGoHome = () => {
    if (loading || disabled) return;
    window.location.href = "/";
  };

  // Right column illustration (always present)
  const rightColumn = (
    <div className="profile-right">
      <div className="profile-illustration-bg">
        <img
          src="./image_R.png"
          alt="Illustration"
          className="profile-illustration-img"
        />
      </div>
    </div>
  );

  // Left column content by mode
  let leftColumn;
  if (mode === "summary") {
    leftColumn = (
      <div className="profile-left">
        <div className="profile-logo">
          <span className="profile-logo-icon icon-network" />
          <span className="profile-logo-text">
            DNJS Web Application Network
          </span>
        </div>
        <div className="profile-heading">Account Manager</div>
        <div className="profile-subtext">You can update your details here</div>
        <img
          src={user.avatar || "./default-profile.svg"}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.email}</div>
        <div className="profile-title">{user.description}</div>
        <div className="profile-btn-row">
          <button
            className="btn-edit"
            onClick={() => setMode("edit-menu")}
            disabled={loading || disabled}
          >
            <span className="btn-icon icon-edit" /> Edit Profile
          </button>
          <button
            className="btn-logout-outline"
            onClick={handleLogout}
            disabled={loading || disabled || localLoading}
          >
            <span className="btn-icon icon-logout" /> Logout
          </button>
        </div>
        <button
          className="homepage-btn"
          onClick={handleGoHome}
          disabled={loading || disabled}
        >
          Go to Homepage
        </button>
      </div>
    );
  } else if (mode === "edit-menu") {
    leftColumn = (
      <div className="profile-left">
        <div className="profile-logo">
          <span className="profile-logo-icon icon-network" />
          <span className="profile-logo-text">
            DNJS Web Application Network
          </span>
        </div>
        <div className="profile-heading">Edit Profile</div>
        <div className="profile-subtext">
          Update your details and security options
        </div>
        <div className="profile-edit-links">
          <button
            className="profile-link"
            onClick={() => setMode("edit-info")}
            disabled={loading || disabled}
          >
            Update Name and Description
          </button>
          <button
            className="profile-link"
            onClick={() => setMode("edit-avatar")}
            disabled={loading || disabled}
          >
            Update or Remove Avatar
          </button>
          <button
            className="profile-link"
            onClick={() => setMode("edit-password")}
            disabled={loading || disabled}
          >
            Change Password
          </button>
          <button
            className="profile-link"
            onClick={() => setMode("edit-email")}
            disabled={loading || disabled}
          >
            Change Email
          </button>
        </div>
        <button
          className="btn-primary btn-fullwidth"
          onClick={() => setMode("summary")}
          disabled={loading || disabled}
        >
          Go Back
        </button>
      </div>
    );
  } else if (mode === "edit-info") {
    leftColumn = (
      <div className="profile-left">
        <div className="profile-logo profile-logo-margin">
          <span className="profile-logo-icon icon-network" />
          <span className="profile-logo-text">
            DNJS Web Application Network
          </span>
        </div>
        <div className="profile-heading profile-heading-small">
          Name and Description
        </div>
        <div className="profile-subtext profile-subtext-small">
          Your name and a short description about you
        </div>
        <div className="profile-edit-fields">
          <div className="input-icon-row input-icon-inside input-row-margin">
            <input
              className="asg10-input input-with-icon"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              disabled={loading || disabled}
            />
            <span className="input-icon input-icon-absolute input-icon-person" />
          </div>
          <div className="input-icon-row input-icon-inside">
            <input
              className="asg10-input input-with-icon"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              disabled={loading || disabled}
            />
            <span className="input-icon input-icon-absolute input-icon-info" />
          </div>
        </div>
        <div className="profile-btn-row profile-btn-row-small">
          <button
            className="btn-primary btn-small"
            onClick={() => setMode("edit-menu")}
            disabled={loading || disabled}
          >
            Close
          </button>
          <button
            className="btn-primary btn-small"
            onClick={() => {
              handleProfileUpdate(name, description);
              setMode("summary");
            }}
            disabled={loading || disabled}
          >
            Save Details
          </button>
        </div>
      </div>
    );
  } else if (mode === "edit-avatar") {
    leftColumn = (
      <div className="profile-left">
        <div className="profile-logo profile-logo-margin">
          <span className="profile-logo-icon icon-network" />
          <span className="profile-logo-text">
            DNJS Web Application Network
          </span>
        </div>
        <div className="profile-heading profile-heading-small">
          Update Avatar
        </div>
        <div className="profile-subtext profile-subtext-small">
          Display image for your profile
        </div>
        <div className="avatar-center avatar-center-margin">
          <label htmlFor="avatar-upload-input" className="avatar-upload-label">
            <img
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : user.avatar || "/default-profile.svg"
              }
              alt="Profile"
              className="profile-pic-small"
            />
            <input
              id="avatar-upload-input"
              type="file"
              accept="image/*"
              className="avatar-upload-input"
              onChange={(e) => {
                if (e.target.files && e.target.files[0])
                  setAvatarFile(e.target.files[0]);
              }}
              disabled={loading || disabled}
            />
          </label>
        </div>
        <div className="profile-btn-row profile-btn-row-small">
          <button
            className="btn-primary btn-outline-blue"
            onClick={handleAvatarUpload}
            disabled={loading || disabled}
          >
            <span className="btn-icon-svg icon-upload" />
            Upload
          </button>
          <button
            className="btn-logout-outline btn-outline-red"
            onClick={handleAvatarRemove}
            disabled={loading || disabled}
          >
            <span className="btn-icon-svg icon-remove" />
            Remove
          </button>
        </div>
        <button
          className="btn-primary btn-fullwidth btn-small"
          onClick={() => setMode("edit-menu")}
          disabled={loading || disabled}
        >
          Close
        </button>
      </div>
    );
  } else if (mode === "edit-password") {
    leftColumn = (
      <div className="profile-left">
        <div className="profile-logo profile-logo-margin">
          <span className="profile-logo-icon icon-network" />
          <span className="profile-logo-text">
            DNJS Web Application Network
          </span>
        </div>
        <div className="profile-heading profile-heading-small">
          Change Password
        </div>
        <div className="profile-subtext profile-subtext-small">
          Make your account safe and secure
        </div>
        {/* Password error message */}
        {passwordError && (
          <div style={{ color: "red", fontWeight: "bold" }}>
            {passwordError}
          </div>
        )}
        <div className="profile-edit-fields">
          <div className="input-icon-row input-icon-inside input-row-margin">
            <input
              className="asg10-input input-with-icon"
              type="password"
              autoComplete="current-password"
              value={passwords.current}
              onChange={(e) => {
                setPasswords({ ...passwords, current: e.target.value });
                setPasswordError("");
              }}
              placeholder="Current Password"
              disabled={loading || disabled}
            />
            <span className="input-icon input-icon-absolute input-icon-lock" />
          </div>
          <div className="input-icon-row input-icon-inside input-row-margin">
            <input
              className="asg10-input input-with-icon"
              type="password"
              autoComplete="new-password"
              value={passwords.new}
              onChange={(e) => {
                setPasswords({ ...passwords, new: e.target.value });
                setPasswordError("");
              }}
              placeholder="New Password"
              disabled={loading || disabled}
            />
            <span className="input-icon input-icon-absolute input-icon-lock" />
          </div>
          <div className="input-icon-row input-icon-inside">
            <input
              className="asg10-input input-with-icon"
              type="password"
              autoComplete="new-password"
              value={passwords.confirm}
              onChange={(e) => {
                setPasswords({ ...passwords, confirm: e.target.value });
                setPasswordError("");
              }}
              placeholder="Confirm New Password"
              disabled={loading || disabled}
            />
            <span className="input-icon input-icon-absolute input-icon-lock" />
          </div>
        </div>
        <div className="profile-btn-row profile-btn-row-small">
          <button
            className="btn-primary btn-small"
            onClick={() => setMode("edit-menu")}
            disabled={loading || disabled}
          >
            Close
          </button>
          <button
            className="btn-primary btn-small"
            onClick={handleChangePassword}
            disabled={loading || disabled}
          >
            Change Password
          </button>
        </div>
      </div>
    );
  } else if (mode === "edit-email") {
    leftColumn = (
      <div className="profile-left">
        <div className="profile-logo profile-logo-margin">
          <span className="profile-logo-icon icon-network" />
          <span className="profile-logo-text">
            DNJS Web Application Network
          </span>
        </div>
        <div className="profile-heading profile-heading-small">
          Change Email
        </div>
        <div className="profile-subtext profile-subtext-small">
          We will send a verification link to your new email
        </div>
        <div className="profile-edit-fields">
          <div className="input-icon-row input-icon-inside">
            <input
              className="asg10-input input-with-icon"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="New Email"
              disabled={loading || disabled}
            />
            <span className="input-icon input-icon-absolute input-icon-mail" />
          </div>
        </div>
        <div className="profile-btn-row profile-btn-row-small">
          <button
            className="btn-primary btn-small"
            onClick={() => setMode("edit-menu")}
            disabled={loading || disabled}
          >
            Close
          </button>
          <button
            className="btn-primary btn-small"
            onClick={handleEmailChange}
            disabled={loading || disabled}
          >
            Send verification link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      {leftColumn}
      {rightColumn}
    </div>
  );
}
