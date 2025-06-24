import React, { useState } from "react";

export default function ProfileScreen({
  user,
  handleLogout,
  handleProfileUpdate,
  avatarFile,
  setAvatarFile,
  handleAvatarUpload,
  avatarUploadMessage,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  verifyPassword,
  setVerifyPassword,
  passwordError,
  handleChangePassword,
}) {
  const [mode, setMode] = useState("summary"); // summary, edit, avatar, password
  const [name, setName] = useState(user.name);
  const [description, setDescription] = useState(user.description);

  // Navigation helpers
  const goHome = () => (window.location.href = "/");

  // Main content switcher
  let content;
  if (mode === "summary") {
    content = (
      <>
        <div className="profile-logo">🔷 DNJS Web Application Network</div>
        <div className="profile-heading">Account Manager</div>
        <div className="profile-subtext">You can update your details here</div>
        <img
          src={user.avatar || "https://i.ibb.co/Zd5Qzj2/profile.jpg"}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.email}</div>
        <div className="profile-title">Intern—Software Engineer</div>
        <div className="profile-btn-row">
          <button
            className="btn-primary"
            onClick={() => setMode("edit-menu")}
          >
            Edit Profile
          </button>
          <button className="btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <button className="homepage-btn" onClick={goHome}>
          Go to Homepage
        </button>
      </>
    );
  } else if (mode === "edit-menu") {
    content = (
      <>
        <div className="profile-heading">Edit Profile</div>
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
        </div>
        <button
          className="btn-outline"
          onClick={() => setMode("summary")}
        >
          Back
        </button>
      </>
    );
  } else if (mode === "edit-info") {
    content = (
      <>
        <div className="profile-heading">Update Name and Description</div>
        <div className="profile-edit-fields">
          <label>Name</label>
          <input
            className="asg10-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Description</label>
          <input
            className="asg10-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="profile-btn-row">
          <button
            className="btn-primary"
            onClick={() => {
              handleProfileUpdate(name, description);
              setMode("summary");
            }}
          >
            Save
          </button>
          <button
            className="btn-outline"
            onClick={() => setMode("edit-menu")}
          >
            Cancel
          </button>
        </div>
      </>
    );
  } else if (mode === "edit-avatar") {
    content = (
      <>
        <div className="profile-heading">Update or Remove Avatar</div>
        <div className="profile-upload-row">
          <div className="profile-upload-left">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </div>
          <div className="profile-upload-right">
            {avatarFile && (
              <div className="avatar-preview-box">
                <img
                  src={URL.createObjectURL(avatarFile)}
                  alt="Selected Preview"
                  className="avatar-preview-img"
                />
              </div>
            )}
          </div>
        </div>
        <div className="profile-btn-row">
          <button className="btn-primary" onClick={handleAvatarUpload}>
            Upload
          </button>
          <button
            className="btn-outline"
            onClick={() => setMode("edit-menu")}
          >
            Cancel
          </button>
        </div>
        {avatarUploadMessage && (
          <div className="asg10-error avatar-upload-message">
            {avatarUploadMessage}
          </div>
        )}
      </>
    );
  } else if (mode === "edit-password") {
    content = (
      <>
        <div className="profile-heading">Change Password</div>
        <div className="profile-password-row">
          <label>Current Password</label>
          <input
            className="asg10-input"
            type="password"
            placeholder="enter the current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label>New Password</label>
          <input
            className="asg10-input"
            type="password"
            placeholder="enter the new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label>Verify New Password</label>
          <input
            className="asg10-input"
            type="password"
            placeholder="re enter the new password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
          <div className="profile-btn-row">
            <button className="btn-primary" onClick={handleChangePassword}>
              Change Password
            </button>
            <button
              className="btn-outline"
              onClick={() => setMode("edit-menu")}
            >
              Cancel
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
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-left">{content}</div>
      </div>
    </div>
  );
}
