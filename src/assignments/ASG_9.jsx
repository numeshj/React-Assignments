import BackToHome from "../component/BackToHome";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ASG_9() {
  const [color, setColor] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredColors, setFilteredColors] = useState([]);
  const [page, setPage] = useState();
  const [limit, setLimit] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://apis.dnjs.lk/objects/colors.php"
        );
        setColor(response.data);
        console.log("Original Array : ", response.data);
        setFilteredColors(response.data);
      } catch (err) {
        console.log("Error when fetch Data : ", err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = color.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColors(filtered);
    console.log("Filtered List : ", filtered);
  };

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-9</h1>
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
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: item.code,
                borderRadius: "4px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            ></span>
          </li>
        ))}
      </ul>
    </>
  );
}
