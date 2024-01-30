//After time out, the score will automatically display. 

import React, { useState, useEffect } from 'react';
import './App.css';
import questions from './Questions';

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(''));
  const [quizFinished, setQuizFinished] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleAnswerSelect = (answer) => {
    if (!userAnswers[currentQuestion] && !quizFinished) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestion] = answer;
      setUserAnswers(updatedAnswers);

      if (answer !== questions[currentQuestion].correctAnswer) {
        setShowCorrectAnswers(true);
      }
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

  const finishQuiz = () => {
    setQuizFinished(true);
    setRemainingTime(0); // Stop the timer
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(questions.length).fill(''));
    setQuizFinished(false);
    setShowCorrectAnswers(false);
    setRemainingTime(questions.length * 3); // Reset the remaining time
  };

  const score = calculateScore();
  const category = getCategory(score);

  const isNextButtonDisabled = () => {
    return userAnswers[currentQuestion] === '' && !quizFinished;
  };

  useEffect(() => {
    if (!quizFinished && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    } else if (remainingTime <= 0) {
      finishQuiz();
    }
  }, [remainingTime, quizFinished]);

  useEffect(() => {
    if (!quizFinished) {
      setRemainingTime(questions.length * 3); // 30 seconds per question
    }
  }, [quizFinished]);

  return (
    <div className="font-mono container mx-auto my-8 p-5 bg-gray-100 rounded-lg shadow-lg w-1/2 mt-40">
      <h1 className="text-indigo-500 text-2xl font-bold mb-4">Computer & IT Literacy Quiz</h1>
      {quizFinished ? (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Your score: {score}/{questions.length}
          </h2>
          <p className="text-lg mb-2">{category}</p>
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded"
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
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
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
              Question {currentQuestion + 1} of {questions.length} | Time Left: {remainingTime} seconds
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
    </div>
  );
};

export default QuizApp;
