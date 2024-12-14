import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Button } from './components/Button';
import { SearchBar } from './components/SearchBar';
import { TableOfContents } from './components/TableOfContents';
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeMessage } from './components/WelcomeMessage';
import { formatTimeAgo } from './utils/helpers';
import { MaterialContent } from './components/MaterialContent';

const LazyAboutPage = lazy(() => import('./components/AboutPage'));
const LazyExercisePage = lazy(() => import('./components/ExercisePage'));

const MainContent = () => {
  const navigate = useNavigate();
  const { topicId, materialId } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedMaterialContent, setSelectedMaterialContent] = useState('');
  const [showExercise, setShowExercise] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicsText, setTopicsText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisited, setLastVisited] = useState([]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/topics.md');
        if (!response.ok) throw new Error('Failed to load topics');
        
        const text = await response.text();
        setTopicsText(text);
        
        const parsedTopics = parseTopics(text);
        setTopics(parsedTopics);
        setIsLoading(false);

        if (topicId && materialId) {
          handleInitialRoute(parsedTopics, topicId, materialId);
        }
      } catch (err) {
        console.error('Error loading topics:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadTopics();
    loadLastVisited();
  }, [topicId, materialId]);

  const parseTopics = (text) => {
    const lines = text.split('\n');
    const parsedTopics = [];
    let currentTopic = null;
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        currentTopic = {
          id: line.substring(2).trim().toLowerCase().replace(/\s+/g, '-'),
          name: line.substring(2).trim(),
          materials: []
        };
        parsedTopics.push(currentTopic);
      } else if (line.startsWith('## ') && currentTopic) {
        currentTopic.materials.push({
          id: line.substring(3).trim().toLowerCase().replace(/\s+/g, '-'),
          name: line.substring(3).trim(),
          startLine: index
        });
      }
    });
    
    return parsedTopics;
  };

  const loadLastVisited = () => {
    const visited = JSON.parse(localStorage.getItem('lastVisited') || '[]');
    setLastVisited(visited);
  };

  const updateLastVisited = (topicId, materialId) => {
    const newVisited = [
      { topicId, materialId, timestamp: Date.now() },
      ...lastVisited.filter(v => v.topicId !== topicId || v.materialId !== materialId)
    ].slice(0, 5);
    setLastVisited(newVisited);
    localStorage.setItem('lastVisited', JSON.stringify(newVisited));
  };

  const handleInitialRoute = (parsedTopics, topicId, materialId) => {
    const topic = parsedTopics.find(t => t.id === topicId);
    if (topic) {
      const material = topic.materials.find(m => m.id === materialId);
      if (material) {
        handleMaterialClick(material.name, material.startLine);
        setSelectedTopic(parsedTopics.indexOf(topic));
      }
    }
  };

  const handleMaterialClick = (materialName, startLine) => {
    setSelectedMaterial(materialName);
    setShowExercise(false);

    let content = '';
    const lines = topicsText.split('\n');

    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i];
      if (i !== startLine && line.startsWith('## ')) {
        break;
      }
      content += line + '\n';
    }

    setSelectedMaterialContent(content);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#e0e5ec]">
      <Sidebar 
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicSelect={setSelectedTopic}
        onMaterialSelect={handleMaterialClick}
        lastVisited={lastVisited}
        updateLastVisited={updateLastVisited}
        navigate={navigate}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            {showExercise ? (
              <LazyExercisePage
                material={selectedMaterial}
                onComplete={() => setShowExercise(false)}
                onBack={() => setShowExercise(false)}
              />
            ) : selectedMaterial ? (
              <MaterialContent
                content={selectedMaterialContent}
                topic={topics[selectedTopic]} // Make sure selectedTopic is valid
                material={selectedMaterial}
                onNavigate={handleMaterialClick}
                updateLastVisited={(topicId, materialId) => {
                  if (topics[selectedTopic]) { // Check if topic exists
                    updateLastVisited(topicId, materialId);
                  }
                }}
                navigate={navigate}
              />
            ) : (
              <WelcomeMessage />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/about" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyAboutPage />
          </Suspense>
        } />
        <Route path="/topics/:topicId" element={<MainContent />} />
        <Route path="/topics/:topicId/:materialId" element={<MainContent />} />
      </Routes>
    </Router>
  );
};

export default App;