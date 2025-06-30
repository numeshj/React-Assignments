import BackToHome from "../component/BackToHome";
import "../assignments/AGS_3.css";
import { useEffect, useState } from "react";

export default function ASG_19() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ScrollRestoration, setScore] = useState(0)
  const [showScore, setShowSore] = useState(0)

  useEffect(() => {
    axios
      .get("https://apis.dnjs.lk/objects/quiz.php")
      .then((response) => {
        setQuestions(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching quiz data", error);
      });
  }, []);

  const handleAnswerClick = (selectAnswer) => {
    const correctAnswer = questions[currentIndex].correct
    if(selectAnswer === correctAnswer) {
      setScore(prevScore +1)
    }
  }

  const currentQuestion = questions[currentIndex]

  return (
    <>
      <BackToHome />
      <h1 className="assignment-title">Assignment-19</h1>
      <hr />
      <br />
      <div>
        {currentQuestion && (
          <div>
          <h2> Question {currentIndex+1}</h2>
          <p>{currentQuestion.question}</p>
          <ul>
            {currentQuestion.anwers.map((anwers, index) =>(
              <li key={index}>{anwers}</li>
            ))}
          </ul>
        </div>
        )}
        
      </div>
    </>
  );
}
