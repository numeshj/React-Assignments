import BackToHome from "../component/BackToHome";
import "../assignments/AGS_19.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ASG_19() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    axios
      .get("https://apis.dnjs.lk/objects/quiz.php")
      .then((response) => {
        setQuestions(response.data);
        console.log("Fetched questions:", response);
      })
      .catch((error) => {
        console.error("Error fetching quiz data", error);
      });
  }, []);

  const handleAnswerClick = (selectedKey) => {
    const correctKey = questions[currentIndex].correct;
    console.log("Selected answer:", selectedKey);
    console.log("Correct answer:", correctKey);
    if (parseInt(selectedKey) === correctKey) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        console.log("Score incremented to:", newScore);
        return newScore;
      });
    }
    const nextIndex = currentIndex + 1;
    console.log("Next question index:", nextIndex, "Total questions:", questions.length);
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      console.log("Moving to question:", nextIndex);
    } else {
      setShowScore(true);
      console.log("Quiz completed. Final score:", score + (parseInt(selectedKey) === correctKey ? 1 : 0));
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-container">
      <BackToHome />
      <h1 className="assignment-title">Assignment-19</h1>
      <div className="quiz-progress">
        {showScore
          ? null
          : `Question ${currentIndex + 1} of ${questions.length}`}
      </div>
      {showScore ? (
        <div className="quiz-completed">
          <h2>Quiz Completed</h2>
          <div className="quiz-score">
            Your Score: {score} out of {questions.length}
          </div>
          <button className="quiz-restart-btn" onClick={() => {
            setCurrentIndex(0);
            setScore(0);
            setShowScore(false);
          }}>
            Restart Quiz
          </button>
        </div>
      ) : (
        currentQuestion && (
          <div>
            <div className="quiz-question">{currentQuestion.question}</div>
            <div className="quiz-answers-row">
              <div className="quiz-answers-col">
                {currentQuestion.answers.slice(0, 2).map((text, idx) =>
                  text ? (
                    <button
                      key={idx}
                      className="quiz-answer-btn"
                      onClick={() => handleAnswerClick(idx)}
                    >
                      <span className="quiz-answer-number">{idx + 1}.</span> {text}
                    </button>
                  ) : null
                )}
              </div>
              <div className="quiz-answers-col">
                {currentQuestion.answers.slice(2, 4).map((text, idx) =>
                  text ? (
                    <button
                      key={idx + 2}
                      className="quiz-answer-btn"
                      onClick={() => handleAnswerClick(idx + 2)}
                    >
                      <span className="quiz-answer-number">{idx + 3}.</span> {text}
                    </button>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
