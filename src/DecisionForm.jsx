// DecisionForm.jsx
import React, { useState } from 'react';

export function DecisionForm({ onSubmit }) {
    const [inputs, setInputs] = useState({
        option1: '',
        option2: '',
        option3: ''
    });

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputs);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Option 1:
                <input type="radio" name="option1" value="yes" onChange={handleChange} /> Yes
                <input type="radio" name="option1" value="no" onChange={handleChange} /> No
            </label>
            <label>
                Option 2:
                <select name="option2" onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </label>
            <label>
                Option 3:
                <input type="text" name="option3" onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}
