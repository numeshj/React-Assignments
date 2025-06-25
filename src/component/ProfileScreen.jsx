import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { getStoredToken } from "../utility/helper";

export default function ProfileScreen({ user, onLogout, onUserUpdate }) {
  const [mode, setMode] = useState("summary");
  const [name, setName] = useState(user.name);
  const [description, setDescription] = useState(user.description);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploadMessage, setAvatarUploadMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setName(user.name);
    setDescription(user.description);
  }, [user.name, user.description]);

  // Profile update
  const handleProfileUpdate = (name, description) => {
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
    setAvatarUploadMessage("");
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
        setAvatarUploadMessage("");
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
        setAvatarUploadMessage("Failed to upload avatar.");
      });
  };

  // Avatar remove
  const handleAvatarRemove = () => {
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
            setAvatarFile(null);
            onUserUpdate(response.data);
          })
          .catch(() => {
            Swal.fire(
              "Failed",
              "Failed to remove profile picture.",
              "error"
            );
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

  // Change password
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
      const response = await axios.put(
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

  // Navigation helpers
  const goHome = () => (window.location.href = "/");

  // Main content switcher
  let content;
  if (mode === "summary") {
    content = (
      <>
        <div className="profile-logo">
          <span className="profile-logo-icon icon-network" /> DNJS Web Application Network
        </div>
        <div className="profile-heading">Account Manager</div>
        <div className="profile-subtext">You can update your details here</div>
        <img
          src={user.avatar || "/default-profile.svg"}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.email}</div>
        <div className="profile-title">{user.description}</div>
        <div className="profile-btn-row">
          <button className="btn-edit" onClick={() => setMode("edit-menu")}> <span className="btn-icon icon-edit" /> Edit Profile</button>
          <button className="btn-logout-outline" onClick={onLogout}> <span className="btn-icon icon-logout" /> Logout</button>
        </div>
        <button className="homepage-btn" onClick={goHome}>
          Go to Homepage
        </button>
      </>
    );
  } else if (mode === "edit-menu") {
    content = (
      <>
        <div className="profile-logo">
          <span className="profile-logo-icon icon-network" /> DNJS Web Application Network
        </div>
        <div className="profile-heading">Edit Profile</div>
        <div className="profile-subtext">
          Update your details and security options
        </div>
        <div className="profile-edit-links">
          <button
            className="profile-link"
            onClick={() => setMode("edit-info")}
          >
            Update Name and Description
          </button>
          <button
            className="profile-link"
            onClick={() => setMode("edit-avatar")}
          >
            Update or Remove Avatar
          </button>
          <button
            className="profile-link"
            onClick={() => setMode("edit-password")}
          >
            Change Password
          </button>
          <button
            className="profile-link"
            onClick={() => setMode("edit-email")}
          >
            Change Email
          </button>
        </div>
        <button className="btn-primary btn-fullwidth" onClick={() => setMode("summary")}>
          Go Back
        </button>
      </>
    );
  } else if (mode === "edit-info") {
    content = (
      <>
        <div className="profile-logo profile-logo-margin">
          <span className="profile-logo-icon icon-network" />
          <span className="profile-logo-text">DNJS Web Application Network</span>
        </div>
        <div className="profile-heading profile-heading-small">Name and Description</div>
        <div className="profile-subtext profile-subtext-small">Your name and a short description about you</div>
        <div className="profile-edit-fields">
          <div className="input-icon-row input-icon-inside input-row-margin">
            <input
              className="asg10-input input-with-icon"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={user.name}
            />
            <span className="input-icon input-icon-absolute input-icon-person" />
          </div>
          <div className="input-icon-row input-icon-inside">
            <input
              className="asg10-input input-with-icon"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Intern—Software Engineer"
            />
            <span className="input-icon input-icon-absolute input-icon-info" />
          </div>
        </div>
        <div className="profile-btn-row profile-btn-row-small">
          <button
            className="btn-primary btn-small"
            onClick={() => setMode("edit-menu")}
          >
            Close
          </button>
          <button
            className="btn-primary btn-small"
            onClick={() => {
              handleProfileUpdate(name, description);
              setMode("summary");
            }}
          >
            Save Details
          </button>
        </div>
      </>
    );
  } else if (mode === "edit-avatar") {
    content = (
      <>
        <div className="profile-logo profile-logo-margin">
          <span className="profile-logo-icon icon-network" />
          <span className="profile-logo-text">DNJS Web Application Network</span>
        </div>
        <div className="profile-heading profile-heading-small">Update Avatar</div>
        <div className="profile-subtext profile-subtext-small">Display image for your profile</div>
        <div className="avatar-center avatar-center-margin">
          <label htmlFor="avatar-upload-input" className="avatar-upload-label">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : (user.avatar || "/default-profile.svg")}
              alt="Profile"
              className="profile-pic-small"
            />
            <input
              id="avatar-upload-input"
              type="file"
              accept="image/*"
              className="avatar-upload-input"
              onChange={e => {
                if (e.target.files && e.target.files[0]) setAvatarFile(e.target.files[0]);
              }}
            />
          </label>
        </div>
        <div className="profile-btn-row profile-btn-row-small">
          <button className="btn-primary btn-outline-blue" onClick={handleAvatarUpload}>
            <span className="btn-icon-svg icon-upload" />
            Upload
          </button>
          <button className="btn-logout-outline btn-outline-red" onClick={() => handleAvatarRemove()}>
            <span className="btn-icon-svg icon-remove" />
            Remove
          </button>
        </div>
        <button className="btn-primary btn-fullwidth btn-small" onClick={() => setMode("edit-menu")}>Close</button>
      </>
    );
  } else if (mode === "edit-password") {
    content = (
      <>
        <div className="profile-logo">
          <span className="profile-logo-icon icon-network" /> DNJS Web Application
          Network
        </div>
        <div className="profile-heading">Change Password</div>
        <div className="profile-subtext">Make your account safe and secure</div>
        <div className="profile-password-row">
          <div className="input-icon-row">
            <span className="input-icon icon-password" />
            <input
              className="asg10-input"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="input-icon-row">
            <span className="input-icon icon-password" />
            <input
              className="asg10-input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="input-icon-row">
            <span className="input-icon icon-password" />
            <input
              className="asg10-input"
              type="password"
              placeholder="Confirm New Password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </div>
          <div className="profile-btn-row">
            <button
              className="btn-primary"
              onClick={() => setMode("edit-menu")}
            >
              Close
            </button>
            <button className="btn-primary" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
          {passwordError && (
            <div className="asg10-error" style={{ marginTop: 8 }}>
              {passwordError}
            </div>
          )}
        </div>
      </>
    );
  } else if (mode === "edit-email") {
    content = (
      <>
        <div className="profile-logo">
          <span className="profile-logo-icon icon-network" /> DNJS Web Application Network
        </div>
        <div className="profile-heading">Change Email</div>
        <div className="profile-subtext">Update your email address</div>
        <div className="profile-edit-fields">
          <div className="input-icon-row">
            <span className="input-icon icon-email" />
            <input className="asg10-input" type="email" placeholder="New Email" />
          </div>
        </div>
        <div className="profile-btn-row">
          <button
            className="btn-primary"
            onClick={() => setMode("edit-menu")}
          >
            Close
          </button>
          <button className="btn-primary">Change Email</button>
        </div>
      </>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-left">{content}</div>
      </div>
    </div>
  );
}
