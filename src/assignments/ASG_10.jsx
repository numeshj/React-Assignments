import BackToHome from "../component/BackToHome";
import "../assignments/AGS_10.css";
import { useState } from "react";
import axios from "axios";

export default function ASG_10() {
  const [post, setPost] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    axios
      .post("https://auth.dnjs.lk/api/login", {email : post.email, password : post.password}, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setError("");
        setSuccess("Login successful!");
      })
      .catch((error) => {
        console.log(error);
        setSuccess("");
        setError(error.response?.data?.message || "Login failed");
      });
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-10</h1>
      <hr />
      <br />
      <div className="asg10-login-container">
        <form onSubmit={handleSubmit}>
          <h2>Login :</h2>
          {error && <div className="asg10-error">{error}</div>}
          {success && (
            <pre className="asg10-success">{success}</pre>
          )}
          <label className="asg10-label">Email :</label>
          <input
            className="asg10-input"
            placeholder="Enter the email"
            onChange={handleInput}
            value={post.email}
            name="email"
          />
          <label className="asg10-label">Password :</label>
          <input
            className="asg10-input"
            placeholder="Enter the password"
            onChange={handleInput}
            value={post.password}
            name="password"
            type="password"
          />
          <button className="btn-login" type="submit" disabled={!post.email || !post.password}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
