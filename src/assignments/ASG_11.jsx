import BackToHome from "../component/BackToHome";
import "../assignments/AGS_10.css";
import { useState } from "react";
import axios from "axios";

export default function ASG_11() {
  const [post, setPost] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
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
        console.log(response);
        const token = response.data.access_token;
        localStorage.setItem("authToken", token);
        fetchUserDetails(token);
        setError("");
        setSuccess("You have logged!");
      })
      .catch((error) => {
        console.log(error);
        setSuccess("");
        setError(error.response?.data?.message || "Login failed");
      });
  };

  const fetchUserDetails = (token) => {
    axios
      .get("https://auth.dnjs.lk/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("User Data : ", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch user : ", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setSuccess("");
    setError("");
    setPost({ email: "", password: "" });
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-11</h1>
      <hr />
      <br />
      <div className="asg10-login-container">
        <form onSubmit={handleSubmit}>
          <h2>Login :</h2>
          {error && <div className="asg10-error">{error}</div>}
          {success && <pre className="asg10-success">{success}</pre>}

          {user && (
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
          )}

          {!success && (
            <>
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
              <button
                className="btn-login"
                type="submit"
                disabled={!post.email || !post.password}
              >
                Submit
              </button>
            </>
          )}         

          {success && (
            <div>
              <button className="btn-logout"
                type="button"
                onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
