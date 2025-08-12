import BackToHome from "../component/BackToHome";
import "../assignments/ASG_50.css";
import { useState, useEffect } from "react";

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ASG_50() {
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [done, setDone] = useState([]);

  // Load collections from JSON
  useEffect(() => {
    fetch("./asg50/flip-and-match-collections.json")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setSelected(data[0]?.label || null);
      });
  }, []);

  // Update cards when collection or selection changes
  useEffect(() => {
    if (!collections.length || !selected) return;
    const collection = collections.find((c) => c.label === selected);
    if (!collection) return;
    let arr = shuffle([...collection.items, ...collection.items]);
    setCards(arr.slice(0, 16));
    setFlipped([]);
    setDone([]);
  }, [collections, selected]);

  // Handle card click
  function handleCardClick(idx) {
    if (flipped.includes(idx) || done.includes(idx) || flipped.length === 2)
      return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx] === cards[secondIdx]) {
        // Match found
        setTimeout(() => {
          setDone((prev) => [...prev, firstIdx, secondIdx]);
          setFlipped([]);
        }, 500);
      } else {
        // Not a match
        setTimeout(() => {
          setFlipped([]);
        }, 700);
      }
    }
  }

  return (
    <div className="asg50">
      <BackToHome />
      <h1 className="assignment-title">Assignment-50</h1>
      <hr />
      <br />

      <div className="container-asg50">
        <div className="options-asg50">
          {collections.map((col) => (
            <button
              key={col.label}
              className="option-asg50"
              data-selected={selected === col.label ? "true" : "false"}
              onClick={() => setSelected(col.label)}
            >
              {col.items[0]} {col.label}
            </button>
          ))}
        </div>
        <div className="board-asg50">
          {cards.map((emoji, idx) => (
            <div
              className="card-asg50"
              data-flipped={
                flipped.includes(idx) || done.includes(idx) ? "true" : "false"
              }
              data-done={done.includes(idx) ? "true" : "false"}
              key={idx}
              onClick={() => handleCardClick(idx)}
            >
              <div className="card-asg50-back"></div>
              <div className="card-asg50-front">{emoji}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


