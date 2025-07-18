import { useState } from "react";
import axios from "axios";

export default function LoginScreen({ onLoginSuccess, success, loading = false, disabled = false }) {
  const [post, setPost] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [successMsg, setSuccess] = useState("");

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!post.email || !post.password) return;
    if (loading || disabled) return;
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
        const token = response.data.access_token;
        if (keepLoggedIn) {
          localStorage.setItem("authToken", token);
        } else {
          sessionStorage.setItem("authToken", token);
        }
        fetchUserDetails(token);
        setError("");
        setSuccess("You have logged!");
      })
      .catch((error) => {
        setSuccess("");
        console.log("Error : ", error)
        setError(error.response?.data?.error?.message || "Login failed");
      });
  };

  const fetchUserDetails = (token) => {
    if (!token) return;
    axios
      .get("https://auth.dnjs.lk/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (onLoginSuccess) onLoginSuccess(response.data, token, keepLoggedIn);
      })
      .catch((error) => {
        setError("Failed to fetch user details after login.");
      });
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <div className="asg10-error">{error}</div>}
      {successMsg && <pre className="asg10-success">{successMsg}</pre>}
      <form onSubmit={handleSubmit}>
        <div className="input-icon-row">
          <div className="input-icon input-icon-person"></div>
          <input
            type="email"
            className="asg33-login-input input-with-icon"
            placeholder="Email"
            value={post.email}
            onChange={handleInput}
            name="email"
            disabled={loading || disabled}
            required
          />
        </div>
        <div className="input-icon-row">
          <div className="input-icon input-icon-lock"></div>
          <input
            className="asg10-login-input"
            placeholder="Enter the password"
            onChange={handleInput}
            value={post.password}
            name="password"
            type={showPassword ? "text" : "password"}
            disabled={loading || disabled}
            required
          />
        </div>
        <div className="asg10-checkbox-row">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="asg10-checkbox"
            disabled={loading || disabled}
          />
          <label htmlFor="showPassword" className="asg10-checkbox-label">
            Show Password
          </label>
          <input
            type="checkbox"
            id="keepLoggedIn"
            checked={keepLoggedIn}
            onChange={() => setKeepLoggedIn(!keepLoggedIn)}
            className="asg10-checkbox"
            disabled={loading || disabled}
          />
          <label htmlFor="keepLoggedIn" className="asg10-checkbox-label">
            Keep me logged in
          </label>
        </div>
        <button
          className="btn-login"
          type="submit"
          disabled={!post.email || !post.password || loading || disabled}
        >
          {loading || disabled ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
