import BackToHome from "../component/BackToHome";
import "../assignments/AGS_19.css"; // You can update this path if you create a new CSS
import { useEffect, useState } from "react";
import axios from "axios";

export default function ASG_20() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    axios
      .get("https://apis.dnjs.lk/objects/quiz.php")
      .then((response) => {
        setQuestions(response.data);
        console.log("Fetched questions:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz data", error);
      });
  }, []);

  const handleAnswerClick = (selectedKey) => {
    const correctKey = questions[currentIndex].correct;

    // Store the selected answer
    setUserAnswers((prevAnswers) => [...prevAnswers, selectedKey]);

    if (parseInt(selectedKey) === correctKey) {
      setScore((prevScore) => prevScore + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setShowScore(true);
      setReviewIndex(0); // Start review from first question
    }
  };

  const handleNextReview = () => {
    if (reviewIndex < questions.length - 1) {
      setReviewIndex(reviewIndex + 1);
    }
  };

  const handleLastReview = () => {
    if (reviewIndex > 0) {
      setReviewIndex(reviewIndex - 1);
    }
  };

  const currentQuestion = questions[currentIndex];
  const reviewQuestion = questions[reviewIndex];

  return (
    <div className="quiz-container">
      <BackToHome />
      <h1 className="assignment-title">Assignment-20</h1>

      {!showScore ? (
        <>
          <div className="quiz-progress">
            Question {currentIndex + 1} of {questions.length}
          </div>
          {currentQuestion && (
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
                        <span className="quiz-answer-number">{idx + 1}.</span>{" "}
                        {text}
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
                        <span className="quiz-answer-number">{idx + 3}.</span>{" "}
                        {text}
                      </button>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="quiz-completed">
          <h2>Quiz Completed</h2>
          <div className="quiz-score">
            Your Score: {score} out of {questions.length}
          </div>

          {/* === Review Section === */}
          {reviewQuestion && (
            <div className="review-section">
              <h3>Review: Question {reviewIndex + 1}</h3>

              <div className="review-answers">
                {reviewQuestion.answers.map((text, idx) => {
                  if (!text) return null;

                  const correct = reviewQuestion.correct;
                  const selected = parseInt(userAnswers[reviewIndex]);

                  let className = "review-answer";
                  if (idx === correct && idx === selected) className += " review-answer-correct-selected";
                  else if (idx === correct) className += " review-answer-correct";
                  else if (idx === selected) className += " review-answer-selected";

                  return (
                    <div key={idx} className={className}>
                      {idx + 1}. {text}
                    </div>
                  );
                })}
              </div>

              <div className="review-question-text">
                <strong>{reviewQuestion.question}</strong>
              </div>

              <div className="review-navigation">
                <button onClick={handleLastReview} disabled={reviewIndex === 0}>
                  Last
                </button>
                <button
                  onClick={handleNextReview}
                  disabled={reviewIndex === questions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          <button
            className="quiz-restart-btn"
            style={{ marginTop: 24 }}
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setShowScore(false);
              setUserAnswers([]);
              setReviewIndex(0);
            }}
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
}
