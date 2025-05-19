// App.jsx
import React, { useState } from 'react';
import './App.css';
import { DecisionForm } from './DecisionForm';
import { ResultCard } from './ResultCard';
import { calculateScore } from './scoreEngine';

export default function App() {
    const [score, setScore] = useState(null);

    const handleFormSubmit = (inputs) => {
        const result = calculateScore(inputs);
        setScore(result);
    };

    return (
        <div className="App">
            <h1>Decision Mate</h1>
            <DecisionForm onSubmit={handleFormSubmit} />
            {score !== null && <ResultCard score={score} />}
        </div>
    );
}
