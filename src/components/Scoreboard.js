import React from 'react';

export default function Scoreboard({ score }) {
  return (
    <div className="scoreboard">
      <div className="wrong">
        <strong>{score.incorrect}</strong>
        <span>wrong</span>
      </div>
      <div className="correct">
        <strong>{score.correct}</strong>
        <span>correct</span>
      </div>
    </div>
  );
}
