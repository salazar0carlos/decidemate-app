// ResultCard.jsx
import React from 'react';

export function ResultCard({ score }) {
    return (
        <div>
            <h2>Decision Score</h2>
            <p>Your score is: {score}</p>
            <p>{score >= 50 ? 'High Score' : 'Low Score'}</p>
        </div>
    );
}
