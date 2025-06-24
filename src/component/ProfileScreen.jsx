import { useState } from "react";
import Swal from "sweetalert2";

export default function ProfileScreen({
  user,
  success,
  handleLogout,
  handleProfileUpdate,
  avatarFile,
  setAvatarFile,
  handleAvatarUpload,
  avatarUploadMessage,
}) {
  const [name, setName] = useState(user.name);
  const [description, setDescription] = useState(user.description);

  return (
    <>
      {success && <pre className="asg10-success">{success}</pre>}

      <div className="user-profile">
        <h3>{user.name}</h3>
        <p>{user.description}</p>
        {user.avatar && (
          <img
            src={user.avatar}
            alt="Profile"
            style={{ width: "100px", borderRadius: "50%" }}
          />
        )}
      </div>
      <div className="profile-edit-row">
        <div className="profile-edit-fields">
          <label> Name : </label>
          <input
            placeholder="enter the name"
            className="asg10-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Description : </label>
          <input
            placeholder="enter the description"
            className="asg10-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="profile-edit-actions">
          <button
            className="btn-save"
            onClick={() => handleProfileUpdate(name, description)}
          >
            Save Profile
          </button>
        </div>
      </div>
      <div className="profile-upload-row">
        <div className="profile-upload-left">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            style={{ width: "100%" }}
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
      <div className="profile-upload-action-row">
        <button
          className="btn-upload"
          type="button"
          onClick={handleAvatarUpload}
        >
          Upload Profile Picture
        </button>
        {avatarUploadMessage && (
          <div
            className="asg10-error avatar-upload-message"
          >
            {avatarUploadMessage}
          </div>
        )}
      </div>

      <button className="btn-logout" type="button" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}
