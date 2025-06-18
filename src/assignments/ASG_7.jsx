import BackToHome from "../component/BackToHome";
import "../assignments/AGS_3.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ASG_7() {
  const [color, setColor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://apis.dnjs.lk/objects/colors.php");
        setColor(response.data);
        console.log("Data : ", response.data);
      } catch (err) {
        console.log("Error when fetch Data : ", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-7</h1>
      <hr />
      <br />
      <h2>Colors</h2>
      <ul>
        {color.map((item, index) => (
          <li key={index}>
            {item.name} - {item.code}
          </li>
        ))}
      </ul>
    </>
  );
}
