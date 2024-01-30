//Intro, start button, no time out, display correct answer, colour code for wrong & correct answer.

import React, { useState } from 'react';
import './App.css';
import questions from './Questions';

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(''));
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

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
      return 'You are at the beginner level.';
    } else if (score > 10 && score <= 22) {
      return 'You need more effort.';
    } else {
      return 'You have an outstanding knowledge';
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const finishQuiz = () => {
    setQuizFinished(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(questions.length).fill(''));
    setQuizFinished(false);
    setShowCorrectAnswers(false);
  };

  const score = calculateScore();
  const category = getCategory(score);

  const isNextButtonDisabled = () => {
    // Disable the "Next" button if no answer is selected
    return userAnswers[currentQuestion] === '' && !quizFinished;
  };

  return (
    <div className="font-mono container mx-auto p-5 bg-gray-100 rounded-lg shadow-lg w-1/2 mt-36">
      <h1 className="text-indigo-500 text-2xl font-bold mb-4 text-center">Computer & IT Literacy Quiz</h1>

      {!quizStarted && (
        <div>
         
          <p className="text-md mb-4 text-justify px-4"><strong className='text-lime-600 font-semibold'>Welcome to the Computer & IT Literacy Quiz!</strong> <br/>Test your knowledge in Computer & IT Literacy! This quiz is designed to test your knowledge in the field of computer science and information technology.
            You will be presented with a series of questions, and your goal is to select the correct answers. Each question has a time limit, so be sure to answer promptly.
            Click the <span className='text-orange-500 font-semibold'>"Start Quiz"</span> button when you're ready to begin. Good luck!</p>
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded"
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        </div>
      )}

      {quizStarted && !quizFinished && (
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
              Question {currentQuestion + 1} of {questions.length}
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

      {quizFinished && (
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
      )}
    </div>
  );
};

export default QuizApp;
