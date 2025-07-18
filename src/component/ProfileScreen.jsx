import React, { useState, useEffect } from "react";
import { useLogoutMutation } from "../store/api";
import { getStoredToken } from "../utility/helper";
import "../assignments/ASG_33.css";

export default function ProfileScreen({
  user,
  onUserUpdate,
  loading = false,
  disabled = false,
  onLoggedOut, 
}) {
  const [localLoading, setLocalLoading] = useState(false);
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

  // Logout logic using RTK Query
  const handleLogout = async () => {
    if (loading || disabled || localLoading || logoutLoading) return;
    setLocalLoading(true);
    
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
      setLocalLoading(false);
    }
  };

  // Navigation helpers
  const handleGoHome = () => {
    if (loading || disabled) return;
    window.location.href = "/";
  };

  return (
    <div className="asg33-profile-container">
      <div className="asg33-profile-card">
        <div className="asg33-profile-left">
          <div className="asg33-profile-logo">
            <div className="asg33-profile-logo-icon asg33-icon-network"></div>
            <div className="asg33-profile-logo-text">React Assignment</div>
          </div>
          
          <h2 className="asg33-profile-heading">Profile</h2>
          <p className="asg33-profile-subtext">Manage your account information</p>
          
          <div className="asg33-avatar-center">
            <img
              src={user?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f0f0f0'/%3E%3Ctext x='60' y='60' font-size='48' text-anchor='middle' dy='16' fill='%23666'%3E👤%3C/text%3E%3C/svg%3E"}
              alt="Profile"
              className="asg33-profile-pic"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f0f0f0'/%3E%3Ctext x='60' y='60' font-size='48' text-anchor='middle' dy='16' fill='%23666'%3E👤%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          
          <div className="asg33-profile-name">{user?.name || "User Name"}</div>
          <div className="asg33-profile-email">{user?.email || "user@example.com"}</div>
          <div className="asg33-profile-title">{user?.description || "Software Developer"}</div>
          
          <div className="asg33-profile-btn-row">
            <button
              className="asg33-btn-edit"
              disabled={disabled}
              onClick={() => console.log("Edit profile clicked")}
            >
              <span className="asg33-icon-edit"></span>
              Edit Profile
            </button>
            <button
              className="asg33-btn-logout-outline"
              disabled={disabled || logoutLoading}
              onClick={handleLogout}
            >
              <span className="asg33-icon-logout"></span>
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
          
          <button 
            className="asg33-homepage-btn" 
            disabled={disabled}
            onClick={handleGoHome}
          >
            Go to Homepage
          </button>
        </div>
        
        <div className="asg33-profile-right">
          <div className="asg33-profile-illustration-bg">
            
              <img className="asg33-profile-illustration-img" src="./image_R.png"/>
          </div>
        </div>
      </div>
    </div>
  );
}
