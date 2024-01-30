import React, { useState, useEffect } from 'react';
import './App.css';
import questions from './Questions';

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(''));
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleAnswerSelect = (answer) => {
    if (quizStarted && !userAnswers[currentQuestion] && !quizFinished) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestion] = answer;
      setUserAnswers(updatedAnswers);

      setTimeout(() => {
        if (currentQuestion === questions.length - 1) {
          finishQuiz();
        } else {
          setCurrentQuestion(currentQuestion + 1);
          setShowCorrectAnswers(false);
        }
      }, 1000);
    }
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const getCategory = (score) => {
    if (score <= 10) {
      return 'You are at beginner level.';
    } else if (score > 10 && score <= 20) {
      return 'You need more effort.';
    } else {
      return 'You have an outstanding knowledge';
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setRemainingTime(questions.length * 10); // Change to 10 seconds per question
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    setRemainingTime(0);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(questions.length).fill(''));
    setQuizFinished(false);
    setShowCorrectAnswers(false);
    setRemainingTime(questions.length * 10); // Change to 10 seconds per question
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const isNextButtonDisabled = () => {
    return userAnswers[currentQuestion] === '' && !quizFinished;
  };

  useEffect(() => {
    if (!quizFinished && remainingTime > 0 && quizStarted) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    } else if (remainingTime <= 0 && quizStarted) {
      finishQuiz();
    }
  }, [remainingTime, quizFinished, quizStarted]);

  useEffect(() => {
    if (!quizFinished && quizStarted) {
      setRemainingTime(questions.length * 10); // Change to 10 seconds per question
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [quizFinished, quizStarted]);

  const score = calculateScore();
  const category = getCategory(score);

  return (
    <div className="font-mono container mx-auto my-8 p-5 bg-gray-100 rounded-lg shadow-lg w-1/2 mt-28">
      <h1 className="text-orange-500 text-2xl font-bold mb-4 px-3">Computer & IT Literacy Quiz 💻</h1>
      {!quizStarted ? (
        <div>
          <p className="text-lg mb-4 text-justify px-3">
            <span className='font-semibold text-orange-400 '>Welcome to the Computer & IT Literacy Quiz! 👋 </span> <br/><br/>This quiz is designed to test your knowledge in the field of computer science and information technology.
             This Quiz has a time limit ⏱ so be sure to answer promptly 💡.
            <span className='font-semibold'><br/><br/>Click the <span className='text-orange-500'>"Start Quiz" </span>button when you're ready to begin. <br/> Good luck! 🏆</span>
          </p>
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded"
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          {quizFinished ? (
            <div>
              <h2 className="text-xl font-bold mb-4 px-3">
                Your score: {score}/{questions.length}
              </h2>
              <p className="text-lg mb-2 px-3">{category}</p>
              <button
                className="mt-4 py-2 px-4 bg-blue-400 text-white rounded"
                onClick={restartQuiz}
              >
                Restart
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-lg">{questions[currentQuestion].question}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`py-2 px-4 rounded ${
                      userAnswers[currentQuestion] === option
                        ? option === questions[currentQuestion].correctAnswer
                          ? 'text-white'
                          : 'text-white'
                        : 'bg-white'
                    } border border-blue-500`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={userAnswers[currentQuestion] !== '' || quizFinished}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showCorrectAnswers && (
                <p className="text-red-500 mt-2">
                  Correct Answer: {questions[currentQuestion].correctAnswer}
                </p>
              )}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm">
                  Question {currentQuestion + 1} of {questions.length} | Time Left: {formatTime(remainingTime)}
                </p>
                <button
                  className={`py-2 px-4 bg-blue-500 text-white rounded ${
                    isNextButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (currentQuestion === questions.length - 1) {
                      finishQuiz();
                    } else {
                      setCurrentQuestion(currentQuestion + 1);
                      setShowCorrectAnswers(false);
                    }
                  }}
                  disabled={isNextButtonDisabled()}
                >
                  {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizApp;
