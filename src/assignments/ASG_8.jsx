import BackToHome from "../component/BackToHome";
import "../assignments/AGS_3.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ASG_8() {
  const [color, setColor] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColors, setFilteredColors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://apis.dnjs.lk/objects/colors.php"
        );
        setColor(response.data);
        console.log("Original Array : ", response.data)
        setFilteredColors(response.data);
      } catch (err) {
        console.log("Error when fetch Data : ", err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = color.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColors(filtered);
    console.log("Filtered List : ",filtered)
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-8</h1>
      <hr />
      <br />
      <h2>Colors</h2>
      <label>Search: </label>
      <input
        placeholder="Enter the color"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {filteredColors.map((item, index) => (
          <li key={index}>
            {item.name} - {item.code}
          </li>
        ))}
      </ul>
    </>
  );
}
