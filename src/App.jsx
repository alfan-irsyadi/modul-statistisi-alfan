import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import SearchBar from './components/SearchBar';
import ExercisePage from './components/ExercisePage';
import { getQuestionsForMaterial } from './utils/exerciseManager';

// Neumorphic styles
const styles = {
  container: "min-h-screen flex bg-[#e0e5ec]",
  sidebar: "w-80 p-6 border-r border-gray-200 overflow-y-auto",
  title: "text-2xl font-light mb-6 text-gray-800",
  mainContent: "flex-1 p-8 overflow-y-auto",
  card: "bg-[#e0e5ec] p-8 rounded-2xl shadow-[-10px_-10px_20px_rgba(255,255,255,0.8),10px_10px_20px_rgba(0,0,0,0.15)]",
  topicButton: "w-full text-left px-4 py-2 rounded-xl mb-2 bg-[#e0e5ec] text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
  topicButtonActive: "shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
  materialButton: "w-full text-left px-4 py-2 rounded-xl mb-1 bg-[#e0e5ec] text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
  exerciseButton: "w-full text-left px-4 py-2 rounded-xl bg-[#e0e5ec] text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
  backButton: "px-6 py-2 rounded-xl bg-[#e0e5ec] text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
  aboutButton: "w-full text-left px-4 py-2 mt-4 rounded-xl bg-[#e0e5ec] text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
  searchContainer: "mb-6",
  materialList: "pl-4 space-y-2",
};

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedMaterialContent, setSelectedMaterialContent] = useState('');
  const [showExercise, setShowExercise] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [topicsText, setTopicsText] = useState('');
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/topics.md');
        if (!response.ok) {
          throw new Error('Failed to load topics');
        }
        const text = await response.text();
        setTopicsText(text);
        
        // Parse topics and materials
        const lines = text.split('\n');
        const parsedTopics = [];
        let currentTopic = null;
        
        lines.forEach((line, index) => {
          if (line.startsWith('# ')) {
            currentTopic = {
              name: line.substring(2).trim(),
              materials: []
            };
            parsedTopics.push(currentTopic);
          } else if (line.startsWith('## ') && currentTopic) {
            currentTopic.materials.push({
              name: line.substring(3).trim(),
              startLine: index
            });
          }
        });
        
        setTopics(parsedTopics);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading topics:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadTopics();
  }, []);

  const handleTopicClick = (index) => {
    setSelectedTopic(index === selectedTopic ? null : index);
    setSelectedMaterial(null);
    setShowExercise(false);
  };

  const handleMaterialClick = (materialName, startLine) => {
    setSelectedMaterial(materialName);
    setShowExercise(false);
    
    // Find the content for this material
    let content = '';
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

  const handleExerciseStart = (materialName) => {
    setSelectedMaterial(materialName);
    setShowExercise(true);
  };

  const handleExerciseComplete = (result) => {
    console.log('Exercise completed:', result);
  };

  const handleSearchResult = (result) => {
    if (result) {
      const { startLine } = result;
      const lines = topicsText.split('\n');
      let materialName = '';
      
      // Find the material name by looking for the closest ## heading above this line
      for (let i = startLine; i >= 0; i--) {
        if (lines[i].startsWith('## ')) {
          materialName = lines[i].substring(3).trim();
          break;
        }
      }
      
      if (materialName) {
        // Find the topic index
        const topicIndex = topics.findIndex(topic => 
          topic.materials.some(material => material.name === materialName)
        );
        
        if (topicIndex !== -1) {
          setSelectedTopic(topicIndex);
          handleMaterialClick(materialName, startLine);
        }
      }
    }
  };

  const hasQuestions = (materialName) => {
    const questions = getQuestionsForMaterial(materialName);
    return questions.length > 0;
  };

  // Create searchable sections from topics
  const searchableSections = useMemo(() => {
    if (!topicsText) return [];
    
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

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
                      {hasQuestions(material.name) && (
                        <button
                          className={`${styles.exerciseButton} mt-1 ml-3 text-sm`}
                          onClick={() => handleExerciseStart(material.name)}
                        >
                          Practice
                        </button>
                      )}
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
              onBack={() => setShowExercise(false)}
            />
          </div>
        ) : selectedMaterial ? (
          <div className={styles.card}>
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: marked(selectedMaterialContent) }} />
            <button
              className={`${styles.backButton} mt-8`}
              onClick={() => setSelectedMaterial(null)}
            >
              Back
            </button>
          </div>
        ) : (
          <div className={styles.card}>
            <p className="text-xl text-gray-700">Select a topic and material to begin learning.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
