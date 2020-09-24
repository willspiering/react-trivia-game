import React, { useEffect, useState, useCallback } from 'react';
import Question from './components/Question';
import CategorySelector from './components/CategorySelector';
import ResultModal from './components/ResultModal';
import Scoreboard from './components/Scoreboard';
import './App.css';

function useScoreBoard() {
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  function increase(scoreType) {
    setScore((prevScore) => {
      return { ...prevScore, [scoreType]: prevScore[scoreType] + 1 };
    });
  }
  return { score, increase };
}

function useQuestion(selectedCategory) {
  const [question, setQuestion] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const getQuestion = useCallback(() => {
    setIsCorrect(null);
    let url = 'https://opentdb.com/api.php?amount=1';
    if (selectedCategory !== 'any') url += `&category=${selectedCategory}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setQuestion(data.results[0]));
  }, [selectedCategory]);

  useEffect(() => {
    getQuestion();
  }, [getQuestion, selectedCategory]);

  return { question, isCorrect, setIsCorrect, getQuestion };
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('any');
  const { score, increase } = useScoreBoard();
  const { question, isCorrect, setIsCorrect, getQuestion } = useQuestion(
    selectedCategory
  );

  function handleQuestionAnswered(answer) {
    const isAnswerCorrect = answer === question.correct_answer;
    increase(isAnswerCorrect ? 'correct' : 'incorrect');
    setIsCorrect(isAnswerCorrect);
  }

  return (
    <div className="app">
      {/* show the result modal ----------------------- */}
      {isCorrect !== null && (
        <ResultModal
          question={question}
          getQuestion={getQuestion}
          isCorrect={isCorrect}
        />
      )}

      {/* question header ----------------------- */}
      <div className="question-header">
        <CategorySelector
          category={selectedCategory}
          chooseCategory={setSelectedCategory}
        />
        <Scoreboard score={score} />
      </div>

      {/* the question itself ----------------------- */}
      <div className="question-main">
        {question && (
          <Question
            question={question}
            answerQuestion={handleQuestionAnswered}
          />
        )}
      </div>

      {/* question footer ----------------------- */}
      <div className="question-footer">
        <button onClick={getQuestion}>Go to next question 👉</button>
      </div>
    </div>
  );
}
