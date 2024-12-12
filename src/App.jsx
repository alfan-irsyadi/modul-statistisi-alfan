import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import ExerciseButton from './components/ExerciseButton.jsx';
import { Box, Typography } from '@mui/material';

// Neumorphic styles
const styles = {
  container: "min-h-screen bg-[#e0e5ec] text-gray-700",
  sidebar: "w-72 p-6 bg-[#e0e5ec] border-r border-gray-200 h-screen overflow-y-auto fixed",
  mainContent: "ml-72 p-8 bg-[#e0e5ec] min-h-screen",
  title: "text-2xl font-light mb-8 text-gray-700",
  topicButton: "w-full text-left px-6 py-4 rounded-xl bg-[#e0e5ec] text-gray-700 font-medium transition-all duration-300 mb-4 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  topicButtonActive: "shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  materialButton: "w-full text-left px-5 py-3 rounded-lg bg-[#e0e5ec] text-gray-600 transition-all duration-300 mb-3 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  exerciseButton: "w-full px-5 py-3 rounded-lg bg-[#e0e5ec] text-[#2d4059] font-medium transition-all duration-300 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  backButton: "mt-6 px-6 py-3 rounded-xl bg-[#e0e5ec] text-gray-700 transition-all duration-300 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  card: "p-6 rounded-xl bg-[#e0e5ec] shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[-8px_-8px_15px_rgba(255,255,255,0.8),8px_8px_15px_rgba(0,0,0,0.15)]",
  exerciseCard: "p-6 rounded-xl bg-[#e0e5ec] shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] mb-6",
  exerciseGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  materialList: "space-y-3 mt-4 ml-4",
  placeholder: "text-center text-gray-500 mt-12"
};

function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedMaterialContent, setSelectedMaterialContent] = useState('');
  const [topicsText, setTopicsText] = useState('');
  const [showLatihan, setShowLatihan] = useState(false);

  useEffect(() => {
    fetch('/topics.md')
      .then((response) => response.text())
      .then((text) => {
        setTopicsText(text);
        const lines = text.split('\n');
        const parsedTopics = [];
        let currentTopic = null;

        lines.forEach((line, index) => {
          if (line.startsWith('# ')) {
            if (currentTopic) parsedTopics.push(currentTopic);
            currentTopic = { name: line.slice(2), materials: [], latihan: [] };
          } else if (line.startsWith('## ')) {
            if (currentTopic) {
              currentTopic.materials.push({
                name: line.slice(3),
                startLine: index,
              });
            }
          }
        });

        if (currentTopic) parsedTopics.push(currentTopic);
        setTopics(parsedTopics);
      });
  }, []);

  const handleTopicClick = (topicIndex) => {
    setSelectedTopic(topicIndex === selectedTopic ? null : topicIndex);
    setSelectedMaterialContent('');
    setShowLatihan(false);
    setSelectedMaterial(null);
  };

  const handleMaterialClick = (material, startLine) => {
    setSelectedMaterial(material.trim());
    const lines = topicsText.split('\n');
    const materialContent = [];
    for (let i = startLine + 1; i < lines.length; i++) {
      if (lines[i].startsWith('## ') || lines[i].startsWith('# ')) break;
      materialContent.push(lines[i]);
    }
    setSelectedMaterialContent(materialContent.join('\n'));
    setShowLatihan(false);
  };

  const handleLatihanClick = () => {
    setShowLatihan(true);
    setSelectedMaterialContent('');
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h1 className={styles.title}>E-Learning</h1>
        <nav>
          {topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="mb-6">
              <button
                className={`${styles.topicButton} ${selectedTopic === topicIndex ? styles.topicButtonActive : ''}`}
                onClick={() => handleTopicClick(topicIndex)}
              >
                {topic.name}
              </button>
              {selectedTopic === topicIndex && (
                <div className={styles.materialList}>
                  {topic.materials.map((material, materialIndex) => (
                    <button
                      key={materialIndex}
                      className={styles.materialButton}
                      onClick={() => handleMaterialClick(material.name, material.startLine)}
                    >
                      {material.name}
                    </button>
                  ))}
                  {topic.materials.length > 0 && (
                    <button
                      className={styles.exerciseButton}
                      onClick={handleLatihanClick}
                    >
                      Latihan
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {selectedMaterialContent ? (
          <div className={styles.card}>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(selectedMaterialContent) }}
            />
            {selectedMaterial && (
              <Box sx={{ mt: 4, mb: 4 }}>
                <ExerciseButton materialName={selectedMaterial} />
              </Box>
            )}
            <button
              className={styles.backButton}
              onClick={() => {
                setSelectedMaterialContent('');
                setSelectedMaterial(null);
              }}
            >
              Back to Materials
            </button>
          </div>
        ) : showLatihan ? (
          <div>
            <h2 className={styles.title}>Latihan: {topics[selectedTopic]?.name}</h2>
            <div className={styles.exerciseGrid}>
              {topics[selectedTopic]?.materials.map((material, index) => (
                <div key={index} className={styles.exerciseCard}>
                  <h3 className="text-lg font-light mb-4">{material.name}</h3>
                  <button
                    className={styles.exerciseButton}
                    onClick={() => {
                      setSelectedMaterial(material.name);
                      setShowLatihan(false);
                    }}
                  >
                    Start Exercise
                  </button>
                </div>
              ))}
            </div>
            <button
              className={styles.backButton}
              onClick={() => setShowLatihan(false)}
            >
              Back to Topic
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <p>
              {selectedTopic !== null
                ? 'Select a material or exercise to begin'
                : 'Choose a topic from the sidebar'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
