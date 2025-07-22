import { useState } from "react";
import { useLoginMutation } from "../store/api";

export default function LoginScreen({ onLoginSuccess, success, loading = false, disabled = false }) {
  const [post, setPost] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [successMsg, setSuccess] = useState("");

  const [login, { isLoading: loginLoading }] = useLoginMutation();

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!post.email || !post.password) return;
    if (loading || disabled || loginLoading) return;

    try {
      const response = await login({ 
        email: post.email, 
        password: post.password 
      }).unwrap();
      
      const token = response.access_token;
      if (keepLoggedIn) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }
      
      setError("");
      setSuccess("You have logged!");
      
      if (onLoginSuccess) onLoginSuccess(response.user, token, keepLoggedIn);
    } catch (error) {
      setSuccess("");
      console.log("Error : ", error);
      setError(error.data?.error?.message || "Login failed");
    }
  };

  return (
    <div className="asg33-login-form">
      <h2>Login</h2>
      {error && <div className="asg10-error">{error}</div>}
      {successMsg && <pre className="asg10-success">{successMsg}</pre>}
      <form onSubmit={handleSubmit}>
        <div className="asg33-input-icon-row">
          <div className="asg33-input-icon asg33-input-icon-person"></div>
          <input
            type="email"
            className="asg33-login-input asg33-input-with-icon"
            placeholder="Email"
            value={post.email}
            onChange={handleInput}
            name="email"
            disabled={loading || disabled || loginLoading}
            autoComplete="email"
            required
          />
        </div>
        <div className="asg33-input-icon-row">
          <div className="asg33-input-icon asg33-input-icon-lock"></div>
          <input
            className="asg33-login-input asg33-input-with-icon"
            placeholder="Enter the password"
            onChange={handleInput}
            value={post.password}
            name="password"
            type={showPassword ? "text" : "password"}
            disabled={loading || disabled || loginLoading}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="asg33-checkbox-row">
          <div>
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              disabled={loading || disabled || loginLoading}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          
          <div>
            <input
              type="checkbox"
              id="keepLoggedIn"
              checked={keepLoggedIn}
              onChange={() => setKeepLoggedIn(!keepLoggedIn)}
              disabled={loading || disabled || loginLoading}
            />
            <label htmlFor="keepLoggedIn">Keep me logged in</label>
          </div>
        </div>
        <button
          className="asg33-btn-primary asg33-btn-fullwidth"
          type="submit"
          disabled={!post.email || !post.password || loading || disabled || loginLoading}
        >
          {loading || disabled || loginLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
