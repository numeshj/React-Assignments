import BackToHome from "../component/BackToHome";
import "../assignments/AGS_3.css";
import { useState } from "react";
import axios from "axios";

export default function ASG_10() {
  const [post, setPost] = useState({
    email: "",
    password: "",
  });

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
  event.preventDefault();
  console.log(post); // Add this line
  const formData = new FormData();
formData.append('email', post.email);
formData.append('password', post.password);
axios.post('https://auth.dnjs.lk/api/login', formData)
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
};

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-10</h1>
      <hr />
      <br />
      <div>
        <form onSubmit={handleSubmit}>
          <label>Email : </label>
          <input
            placeholder="Enter the email"
            onChange={handleInput}
            value={post.email}
            name="email"
          />
          <br />
          <label>Password : </label>
          <input
            placeholder="Enter the password"
            onChange={handleInput}
            value={post.password}
            name="password"
            type="password"
          />
          <br />
          <button className="btn-login" type="submit" disabled={!post.email || !post.password}>
  Submit
</button>
        </form>
      </div>
    </>
  );
}
