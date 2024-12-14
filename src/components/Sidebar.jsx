import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/helpers';
import { Button } from './Button';
import { SearchBar } from './SearchBar';
// components/Sidebar.jsx
export const Sidebar = ({ topics, selectedTopic, onTopicSelect, onMaterialSelect, lastVisited, updateLastVisited, navigate }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      className="fixed top-4 left-4 md:hidden z-50"
      onClick={() => setShowMobileMenu(true)}
      icon={
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      }
    />
  );

  const SidebarContent = () => (
    <>
      {/* App Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light text-gray-800">E-Learning</h1>
        <Button
          variant="ghost"
          onClick={() => navigate('/about')}
          className="text-sm"
        >
          About
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar 
          content={topics.flatMap(topic => 
            topic.materials.map(material => ({
              topicId: topic.id,
              materialId: material.id,
              title: material.name,
              content: material.content
            }))
          )}
          onResultClick={(result) => {
            navigate(`/topics/${result.topicId}/${result.materialId}${result.hash || ''}`);
            setShowMobileMenu(false);
          }}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-6" />

      {/* Recently Viewed */}
      {lastVisited.map((item, index) => (
  <button
    key={index}
    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
    onClick={() => {
      navigate(`/topics/${item.topicId}/${item.materialId}`);
      setShowMobileMenu(false);
    }}
  >
    <div>
      {topics.find(t => t.id === item.topicId)?.materials.find(m => m.id === item.materialId)?.name}
    </div>
    <div className="text-xs text-gray-500">
      {formatTimeAgo(item.timestamp)}
    </div>
  </button>
))}

      {/* Topics */}
      <h2 className="text-lg font-semibold mb-3">Topics</h2>
      <div className="space-y-4">
        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="mb-4">
            <button
              className={`w-full text-left px-4 py-2 rounded-xl mb-2 bg-[#e0e5ec] text-gray-700 transition-all duration-300 
                ${selectedTopic === topicIndex ? 
                  'shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]' : 
                  'shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)]'}`}
              onClick={() => {
                onTopicSelect(topicIndex);
                setShowMobileMenu(false);
              }}
            >
              {topic.name}
            </button>

            {selectedTopic === topicIndex && (
              <div className="pl-4 space-y-2">
                {topic.materials.map((material, materialIndex) => (
                  <button
                    key={materialIndex}
                    className="w-full text-left px-4 py-2 rounded-xl bg-[#e0e5ec] text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)]"
                    onClick={() => {
                      onMaterialSelect(material.name, material.startLine);
                      updateLastVisited(topic.id, material.id);
                      navigate(`/topics/${topic.id}/${material.id}`);
                      setShowMobileMenu(false);
                    }}
                  >
                    {material.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="bg-white w-64 h-full p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="md:w-80 p-6 md:h-screen md:sticky md:top-0 overflow-y-auto bg-[#e0e5ec] z-10 hidden md:block">
        <SidebarContent />
      </aside>
    </>
  );
};