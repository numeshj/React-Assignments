import { useState } from "react";
import axios from "axios";

export default function LoginScreen({ onLoginSuccess, success, loading = false, disabled = false }) {
  const [post, setPost] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (!post.email || !post.password) return;
    if (loading || disabled) return;
    axios
      .post(
        "https://auth.dnjs.lk/api/login",
        { email: post.email, password: post.password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        const token = response.data.access_token;
        // Fetch user details after login
        axios
          .get("https://auth.dnjs.lk/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((userRes) => {
            onLoginSuccess(userRes.data, token, keepLoggedIn);
          })
          .catch(() => {
            setError("Failed to fetch user details after login.");
          });
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Login failed");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login :</h2>
      {error && <div className="asg10-error">{error}</div>}
      {success && <pre className="asg10-success">{success}</pre>}
      <label className="asg10-label">Email :</label>
      <input
        className="asg10-login-input"
        placeholder="Enter the email"
        onChange={handleInput}
        value={post.email}
        name="email"
        disabled={loading || disabled}
      />
      <label className="asg10-label">Password :</label>
      <input
        className="asg10-login-input"
        placeholder="Enter the password"
        onChange={handleInput}
        value={post.password}
        name="password"
        type={showPassword ? "text" : "password"}
        disabled={loading || disabled}
      />
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
  );
}
