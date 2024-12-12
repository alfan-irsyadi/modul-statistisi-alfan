// components/Topic.js
import React, { useState } from 'react';
import Materi from './Materi';
import Latihan from './Latihan';

const Topic = () => {
  const [showMateri, setShowMateri] = useState(false);
  const [showLatihan, setShowLatihan] = useState(false);

  const handleMateriClick = () => {
    setShowMateri(!showMateri);
    setShowLatihan(false);
  };

  const handleLatihanClick = () => {
    setShowLatihan(!showLatihan);
    setShowMateri(false);
  };

  return (
    <div className="topic">
      <h2>Topic</h2>
      <button onClick={handleMateriClick}>Materi</button>
      {showMateri && <Materi />}
      <button onClick={handleLatihanClick}>Latihan</button>
      {showLatihan && <Latihan />}
    </div>
  );
};

export default Topic;