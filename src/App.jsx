import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import ExerciseButton from './components/ExerciseButton.jsx';
import SearchBar from './components/SearchBar';
import { Box, Typography } from '@mui/material';
import ExercisePage from './components/ExercisePage.jsx';
import { getQuestionsForMaterial } from './utils/exerciseManager.jsx';

// Neumorphic styles
const styles = {
  container: "min-h-screen bg-[#e0e5ec] text-gray-700",
  sidebar: "w-80 p-4 bg-[#e0e5ec] border-r border-gray-200 h-screen overflow-y-auto fixed",
  mainContent: "ml-80 p-8 bg-[#e0e5ec] min-h-screen",
  title: "text-xl font-light mb-6 text-gray-700",
  topicButton: "w-full text-left px-4 py-3 rounded-xl bg-[#e0e5ec] text-gray-700 font-medium transition-all duration-300 mb-3 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  topicButtonActive: "shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  materialButton: "w-full text-left px-4 py-2 rounded-lg bg-[#e0e5ec] text-gray-600 transition-all duration-300 mb-2 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  exerciseButton: "w-full px-4 py-2 rounded-lg bg-[#e0e5ec] text-[#2d4059] font-medium transition-all duration-300 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  backButton: "mt-4 px-4 py-2 rounded-xl bg-[#e0e5ec] text-gray-700 transition-all duration-300 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  aboutButton: "w-full px-4 py-2 rounded-lg bg-[#e0e5ec] text-gray-700 font-medium transition-all duration-300 mt-4 hover:shadow-[inset_-2px_-2px_8px_rgba(255,255,255,1),inset_2px_2px_8px_rgba(0,0,0,0.15)]",
  card: "p-6 rounded-xl bg-[#e0e5ec] shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[-8px_-8px_15px_rgba(255,255,255,0.8),8px_8px_15px_rgba(0,0,0,0.15)]",
  exerciseCard: "p-6 rounded-xl bg-[#e0e5ec] shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] mb-6",
  exerciseGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  materialList: "space-y-2 mt-3 ml-3",
  placeholder: "text-center text-gray-500 mt-12",
  searchContainer: "mb-6"
};

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedMaterialContent, setSelectedMaterialContent] = useState('');
  const [showExercise, setShowExercise] = useState(false);
  const [showLatihan, setShowLatihan] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [topicsText, setTopicsText] = useState('');
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch('/topics.md')
      .then((response) => response.text())
      .then((text) => {
        setTopicsText(text);
        
        // Parse topics and materials
        const lines = text.split('\n');
        const parsedTopics = [];
        let currentTopic = null;
        
        lines.forEach((line, index) => {
          if (line.startsWith('# ')) {
            // New topic
            currentTopic = {
              name: line.substring(2).trim(),
              materials: []
            };
            parsedTopics.push(currentTopic);
          } else if (line.startsWith('## ') && currentTopic) {
            // New material within current topic
            currentTopic.materials.push({
              name: line.substring(3).trim(),
              startLine: index
            });
          }
        });
        
        setTopics(parsedTopics);
      });
  }, []);

  const handleTopicClick = (index) => {
    setSelectedTopic(index === selectedTopic ? null : index);
    setSelectedMaterial(null);
    setSelectedMaterialContent('');
    setShowExercise(false);
    setShowLatihan(false);
  };

  const handleMaterialClick = (materialName, startLine) => {
    setSelectedMaterial(materialName);
    setShowExercise(false);
    
    // Find the content for this material
    let content = '';
    let foundMaterial = false;
    const lines = topicsText.split('\n');
    
    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i];
      
      // Stop when we reach the next material (## heading)
      if (i !== startLine && line.startsWith('## ')) {
        break;
      }
      
      // Include this line in our content
      content += line + '\n';
    }
    
    setSelectedMaterialContent(content);
  };

  const handleLatihanClick = () => {
    setShowLatihan(true);
    setSelectedMaterial(null);
    setSelectedMaterialContent('');
    setShowExercise(false);
  };

  const handleExerciseStart = (materialName) => {
    setSelectedMaterial(materialName);
    setShowExercise(true);
    setShowLatihan(false);
  };

  const handleExerciseComplete = () => {
    setShowExercise(false);
    setShowLatihan(true);
  };

  const handleSearchResult = (result) => {
    const [topicName, materialName] = result.id.split('|');
    const topicIndex = topics.findIndex(t => t.name === topicName);
    if (topicIndex !== -1) {
      setSelectedTopic(topicIndex);
      const material = topics[topicIndex].materials.find(m => m.name === materialName);
      if (material) {
        handleMaterialClick(material.name, material.startLine);
      }
    }
  };

  const hasQuestions = (materialName) => {
    const questions = getQuestionsForMaterial(materialName);
    return questions.length > 0;
  };

  // Create searchable sections from topics
  const searchableSections = useMemo(() => {
    const sections = [];
    let currentContent = '';
    
    const lines = topicsText.split('\n');
    lines.forEach((line, index) => {
      if (line.startsWith('# ') || line.startsWith('## ')) {
        if (currentContent.trim()) {
          sections.push({
            title: currentContent.split('\n')[0].replace(/^[#\s]+/, ''),
            content: currentContent.trim(),
            startLine: index - currentContent.split('\n').length
          });
        }
        currentContent = line + '\n';
      } else {
        currentContent += line + '\n';
      }
    });
    
    if (currentContent.trim()) {
      sections.push({
        title: currentContent.split('\n')[0].replace(/^[#\s]+/, ''),
        content: currentContent.trim(),
        startLine: lines.length - currentContent.split('\n').length
      });
    }
    
    return sections;
  }, [topicsText]);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h1 className={styles.title}>E-Learning</h1>
        <nav>
          <div className={styles.searchContainer}>
            <SearchBar 
              content={searchableSections}
              onResultClick={handleSearchResult}
            />
          </div>
          {topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="mb-4">
              <button
                className={`${styles.topicButton} ${selectedTopic === topicIndex ? styles.topicButtonActive : ''}`}
                onClick={() => handleTopicClick(topicIndex)}
              >
                {topic.name}
              </button>
              {selectedTopic === topicIndex && (
                <div className={styles.materialList}>
                  {topic.materials.map((material, materialIndex) => (
                    <div key={materialIndex} className="mb-2">
                      <button
                        className={styles.materialButton}
                        onClick={() => handleMaterialClick(material.name, material.startLine)}
                      >
                        {material.name}
                      </button>
                       {/* {hasQuestions(material.name) && (
                        <button
                          className={`${styles.exerciseButton} mt-1 ml-3 text-sm`}
                          onClick={() => handleExerciseStart(material.name)}
                        >
                          Practice
                        </button>
                      )} */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            className={styles.aboutButton}
            onClick={() => setShowAbout(true)}
          >
            About Me
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {showAbout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#e0e5ec] p-8 rounded-2xl shadow-[-10px_-10px_20px_rgba(255,255,255,0.8),10px_10px_20px_rgba(0,0,0,0.15)] max-w-lg w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
              <p className="text-gray-700 mb-6">
                Hi! I'm a passionate developer dedicated to creating interactive learning experiences.
                This application is designed to help students learn statistics in an engaging way.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:alfan@email.com" className="text-blue-600 hover:text-blue-800">alfan@email.com</a>
                </div>
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                  <a href="https://github.com/alfan" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">github.com/alfan</a>
                </div>
              </div>
              <button
                className="mt-8 px-6 py-2 bg-[#e0e5ec] rounded-xl text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]"
                onClick={() => setShowAbout(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {showExercise ? (
          <div className={styles.card}>
            <ExercisePage
              questions={getQuestionsForMaterial(selectedMaterial)}
              onComplete={handleExerciseComplete}
            />
            <button
              className={styles.backButton}
              onClick={() => {
                setShowExercise(false);
                handleMaterialClick(selectedMaterial, topics[selectedTopic].materials.find(m => m.name === selectedMaterial).startLine);
              }}
            >
              Back to Material
            </button>
          </div>
        ) : selectedMaterialContent ? (
          <div className={styles.card}>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(selectedMaterialContent) }}
            />
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
        ) : (
          <div className={styles.placeholder}>
            <p>
              {selectedTopic !== null
                ? 'Select a material to begin'
                : 'Choose a topic from the sidebar'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
