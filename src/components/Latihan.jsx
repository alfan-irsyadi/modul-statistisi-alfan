// components/Latihan.js
import React, { useState } from 'react';

const Latihan = () => {
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartLatihan = () => {
    // Simulate a latihan session
    const result = Math.floor(Math.random() * 10);
    setScore(result);
    setShowResult(true);
  };

  return (
    <div className="latihan">
      <h3>Latihan</h3>
      <button onClick={handleStartLatihan}>Mulai Latihan</button>
      {showResult && (
        <div>
          <p>Result: {score}/10</p>
        </div>
      )}
    </div>
  );
};

export default Latihan;