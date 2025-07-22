import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation, useUpdateUserMutation, useUploadAvatarMutation, useRemoveAvatarMutation, useChangePasswordMutation, useChangeEmailMutation } from "../store/api";
import { setMode, setSubscriptionEnabled, updateUser as updateUserAction } from "../store/authSlice";
import Swal from "sweetalert2";
import { getStoredToken } from "../utility/helper";
import "../assignments/ASG_33.css";

export default function ProfileScreen({
  user,
  onUserUpdate,
  loading = false,
  disabled = false,
  onLoggedOut, 
}) {
  const dispatch = useDispatch();
  const { mode, subscriptionEnabled } = useSelector((state) => state.auth);
  
  const [name, setName] = useState(user?.name || "");
  const [description, setDescription] = useState(user?.description || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Local loading state for button feedback
  const [localLoading, setLocalLoading] = useState(false);

  // RTK Query mutations
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [uploadAvatar, { isLoading: uploadLoading }] = useUploadAvatarMutation();
  const [removeAvatar, { isLoading: removeLoading }] = useRemoveAvatarMutation();
  const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();
  const [changeEmail, { isLoading: emailLoading }] = useChangeEmailMutation();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setDescription(user.description || "");
    }
  }, [user]);

  useEffect(() => {
    setLocalLoading(
      logoutLoading || updateLoading || uploadLoading || 
      removeLoading || passwordLoading || emailLoading
    );
  }, [logoutLoading, updateLoading, uploadLoading, removeLoading, passwordLoading, emailLoading]);

  // Profile update
  const handleProfileUpdate = async (name, description) => {
    if (loading || disabled || updateLoading) return;
    const token = getStoredToken();
    if (!token) return;
    
    try {
      const response = await updateUser({ token, name, description }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile was updated successfully!",
        showConfirmButton: true,
        timer: 5000,
      });
      dispatch(updateUserAction(response.data));
      if (onUserUpdate) onUserUpdate(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile.",
        showConfirmButton: true,
      });
    }
  };

  // Avatar upload
  const handleAvatarUpload = async () => {
    if (loading || disabled || uploadLoading) return;
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
    
    try {
      const response = await uploadAvatar({ token, formData }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Profile Picture Uploaded",
        text: "Profile picture uploaded successfully.",
        showConfirmButton: true,
      });
      setAvatarFile(null);
      dispatch(updateUserAction(response.data));
      if (onUserUpdate) onUserUpdate(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload avatar.",
        showConfirmButton: true,
      });
    }
  };

  // Avatar remove
  const handleAvatarRemove = async () => {
    if (loading || disabled || removeLoading) return;
    const token = getStoredToken();
    if (!token) return;
    
    const result = await Swal.fire({
      title: "Remove Profile Picture?",
      text: "Are you sure you want to remove your profile picture?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d50000",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });
    
    if (result.isConfirmed) {
      try {
        const response = await removeAvatar(token).unwrap();
        Swal.fire(
          "Removed!",
          "Your profile picture has been removed.",
          "success"
        );
        dispatch(updateUserAction(response.data));
        if (onUserUpdate) onUserUpdate(response.data);
      } catch (error) {
        Swal.fire("Failed", "Failed to remove profile picture.", "error");
      }
    }
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
    if (loading || disabled || passwordLoading) return;

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

    const token = getStoredToken();
    try {
      await changePassword({
        token,
        old_password: passwords.current,
        new_password: passwords.new,
        new_password_confirmation: passwords.confirm,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Your password was changed successfully!",
      });

      setPasswords({ current: "", new: "", confirm: "" });
      setPasswordError("");
      dispatch(setMode("edit-menu"));
    } catch (err) {
      console.log(err);
      setPasswordError(err.data?.error?.message || "Failed to change the password");
    }
  };

  // Logout logic
  const handleLogout = async () => {
    if (loading || disabled || logoutLoading) return;
    
    const token = getStoredToken();
    
    try {
      if (token) {
        await logout(token).unwrap();
      }
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      if (onLoggedOut) onLoggedOut();
    }
  };

  // Change email
  const handleEmailChange = async () => {
    if (loading || disabled || emailLoading) return;
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
      await changeEmail({ token, email }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Verification Sent",
        text: "A verification link has been sent to your new email.",
        showConfirmButton: true,
      });
      setEmail("");
      setEmailError("");
      dispatch(setMode("edit-menu"));
    } catch (error) {
      console.log(error);
      const message = error.data?.error?.message || "Failed to change email";
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
    window.location.href = "/";
  };

  // Render different modes
  let leftColumn;
  let rightColumn = (
    <div className="asg33-section asg33-secondary">
      {/* Background image is handled by CSS */}
    </div>
  );

  if (mode === "summary") {
    leftColumn = (
      <div className="asg33-section asg33-primary">
        <div className="asg33-content">
          <div className="asg33-heading">
            <div className="asg33-heading-logo"></div>
            <div className="asg33-heading-title">Account Manager</div>
            <div className="asg33-heading-description">
              You can update your details here
            </div>
          </div>
          <div className="asg33-profile">
            <div className="asg33-profile-avatar" data-active>
              <img
                src={user?.avatar || "/default-profile.svg"}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "/default-profile.svg";
                }}
              />
            </div>
            <div className="asg33-profile-data">
              <div className="asg33-profile-name">{user?.name || "User Name"}</div>
              <div className="asg33-profile-email">{user?.email}</div>
              <div className="asg33-profile-description">{user?.description}</div>
            </div>
            <div className="asg33-profile-buttons">
              <button
                className="asg33-profile-button asg33-edit"
                onClick={() => dispatch(setMode("edit-menu"))}
                disabled={loading || disabled}
              >
              </button>
              <button
                className="asg33-profile-button asg33-logout"
                onClick={handleLogout}
                disabled={loading || disabled || localLoading}
              >
              </button>
            </div>
            <div className="asg33-profile-subscription">
              <input
                type="checkbox"
                className="asg33-profile-subscription-switch"
                checked={subscriptionEnabled}
                onChange={(e) => dispatch(setSubscriptionEnabled(e.target.checked))}
                disabled={disabled}
              />
              <span className="asg33-profile-subscription-text">Email Subscription</span>
            </div>
            <button
              className="asg33-action"
              onClick={handleGoHome}
              disabled={loading || disabled}
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  } else if (mode === "edit-menu") {
    leftColumn = (
      <div className="asg33-section asg33-primary">
        <div className="asg33-content">
          <div className="asg33-heading">
            <div className="asg33-heading-logo"></div>
            <div className="asg33-heading-title">Edit Profile</div>
            <div className="asg33-heading-description">
              Update your details and security options
            </div>
          </div>
          <div className="asg33-editor">
            <div className="asg33-question" data-align="left">
              <button
                className="asg33-question-link"
                onClick={() => dispatch(setMode("edit-info"))}
                disabled={loading || disabled}
              >
                Update Name and Description
              </button>
            </div>
            <div className="asg33-question" data-align="left">
              <button
                className="asg33-question-link"
                onClick={() => dispatch(setMode("edit-avatar"))}
                disabled={loading || disabled}
              >
                Update or Remove Avatar
              </button>
            </div>
            <div className="asg33-question" data-align="left">
              <button
                className="asg33-question-link"
                onClick={() => dispatch(setMode("edit-password"))}
                disabled={loading || disabled}
              >
                Change Password
              </button>
            </div>
            <div className="asg33-question" data-align="left">
              <button
                className="asg33-question-link"
                onClick={() => dispatch(setMode("edit-email"))}
                disabled={loading || disabled}
              >
                Change Email
              </button>
            </div>
            <button
              className="asg33-action"
              onClick={() => dispatch(setMode("summary"))}
              disabled={loading || disabled}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  } else if (mode === "edit-info") {
    leftColumn = (
      <div className="asg33-section primary">
        <div className="asg33-content">
          <div className="asg33-heading">
            <div className="asg33-heading-logo"></div>
            <div className="asg33-heading-title">Name and Description</div>
            <div className="asg33-heading-description">
              Your name and a short description about you
            </div>
          </div>
          <div className="asg33-editor">
            <input
              className="asg33-input name"
              type="text"
              id= "name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              disabled={loading || disabled}
            />
            <input
              className="asg33-input description"
              id = "description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              disabled={loading || disabled}
            />
            <div className="asg33-editor-cols">
              <button
                className="asg33-action"
                onClick={() => dispatch(setMode("edit-menu"))}
                disabled={loading || disabled}
              >
                Close
              </button>
              <button
                className="asg33-action"
                onClick={() => {
                  handleProfileUpdate(name, description);
                  dispatch(setMode("summary"));
                }}
                disabled={loading || disabled}
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (mode === "edit-avatar") {
    leftColumn = (
      <div className="asg33-section primary">
        <div className="asg33-content">
          <div className="asg33-heading">
            <div className="asg33-heading-logo"></div>
            <div className="asg33-heading-title">Update Avatar</div>
            <div className="asg33-heading-description">
              Display image for your profile
            </div>
          </div>
          <div className="asg33-editor">
            <div className="asg33-profile">
              <div className="asg33-profile-avatar large" data-active>
                <img
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : user?.avatar || "/default-profile.svg"
                  }
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/default-profile.svg";
                  }}
                />
                <label htmlFor="avatar-upload-input">
                  <input
                    id="avatar-upload-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0])
                        setAvatarFile(e.target.files[0]);
                    }}
                    disabled={loading || disabled}
                  />
                  <button
                    className="asg33-profile-avatar-upload"
                    disabled={loading || disabled}
                  />
                </label>
              </div>
              <div className="asg33-profile-buttons">
                <button
                  className="asg33-profile-button upload"
                  onClick={handleAvatarUpload}
                  disabled={loading || disabled}
                >
                </button>
                <button
                  className="asg33-profile-button remove"
                  onClick={handleAvatarRemove}
                  disabled={loading || disabled}
                >
                </button>
              </div>
            </div>
            <button
              className="asg33-action"
              onClick={() => dispatch(setMode("edit-menu"))}
              disabled={loading || disabled}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  } else if (mode === "edit-password") {
    leftColumn = (
      <div className="asg33-section primary">
        <div className="asg33-content">
          <div className="asg33-heading">
            <div className="asg33-heading-logo"></div>
            <div className="asg33-heading-title">Change Password</div>
            <div className="asg33-heading-description">
              Make your account safe and secure
            </div>
          </div>
          <div className="asg33-editor">
            <input
              className="asg33-input password"
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
            <input
              className="asg33-input password"
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
            <input
              className="asg33-input password"
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
            {passwordError && (
              <div className="alert error">
                <div className="alert-message">{passwordError}</div>
              </div>
            )}
            <div className="editor-cols">
              <button
                className="asg33-action"
                onClick={() => dispatch(setMode("edit-menu"))}
                disabled={loading || disabled}
              >
                Close
              </button>
              <button
                className="asg33-action"
                onClick={handleChangePassword}
                disabled={loading || disabled}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (mode === "edit-email") {
    leftColumn = (
      <div className="asg33-section primary">
        <div className="asg33-content">
          <div className="asg33-heading">
            <div className="asg33-heading-logo"></div>
            <div className="asg33-heading-title">Change Email</div>
            <div className="asg33-heading-description">
              We will send a verification link to your new email
            </div>
          </div>
          <div className="editor">
            <input
              className="asg33-input email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="New Email"
              disabled={loading || disabled}
            />
            {emailError && (
              <div className="asg33-alert error">
                <div className="asg33-alert-message">{emailError}</div>
              </div>
            )}
            <div className="asg33-editor-cols">
              <button
                className="asg33-action"
                onClick={() => dispatch(setMode("edit-menu"))}
                disabled={loading || disabled}
              >
                Close
              </button>
              <button
                className="asg33-action"
                onClick={handleEmailChange}
                disabled={loading || disabled}
              >
                Send verification
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="asg33-app">
      <div className="asg33-container">
        {leftColumn}
        {rightColumn}
      </div>
    </div>
  );
}
