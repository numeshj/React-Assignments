import BackToHome from "../component/BackToHome";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ASG_9() {
  const [color, setColor] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredColors, setFilteredColors] = useState([]);

  const [currentpage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentpage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredColors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredColors.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://apis.dnjs.lk/objects/colors.php"
        );
        setColor(response.data);
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
    setCurrentPage(1);
    console.log("Filtered List : ", filtered)
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
        {currentItems.map((item, index) => (
          <li key={index}>
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
            {item.name} - {item.code}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentpage === 1}
        >
          Previous
        </button>

        {(() => {
          let startPage = Math.max(currentpage - 1, 1);
          let endPage = Math.min(startPage + 2, totalPages);

          if (endPage - startPage < 2) {
            startPage = Math.max(endPage - 2, 1);
          }

          return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              style={{
                fontWeight: currentpage === num ? "bold" : "normal",
                margin: "0 4px",
              }}
            >
              {num}
            </button>
          ));
        })()}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentpage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}
