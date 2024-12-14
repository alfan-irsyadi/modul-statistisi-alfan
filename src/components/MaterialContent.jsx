import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { Button } from './Button';
import { TableOfContents } from './TableOfContents';

export const MaterialContent = ({ content, topic, material, onNavigate, updateLastVisited, navigate }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if topic and materials exist before finding the index
  const currentMaterialIndex = topic?.materials?.findIndex(m => m.name === material) ?? -1;

  console.log('topic',topic)

  // If we don't have valid topic data, show an error or loading state
  if (!topic || !topic.materials) {
    return (
      <div className="bg-[#e0e5ec] p-4 md:p-8 rounded-2xl shadow-[-10px_-10px_20px_rgba(255,255,255,0.8),10px_10px_20px_rgba(0,0,0,0.15)]">
        <p className="text-gray-700">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-[#e0e5ec] p-4 md:p-8 rounded-2xl shadow-[-10px_-10px_20px_rgba(255,255,255,0.8),10px_10px_20px_rgba(0,0,0,0.15)]">
      {/* Progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-500 transition-all duration-300" 
        style={{ width: `${progress}%` }} 
      />

      {/* Content */}
      <div className="prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeSlug]}
          className="[&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_th]:bg-gray-100"
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={() => {
            if (currentMaterialIndex > 0) {
              const prevMaterial = topic.materials[currentMaterialIndex - 1];
              onNavigate(prevMaterial.name, prevMaterial.startLine);
              updateLastVisited(topic.id, prevMaterial.id);
              navigate(`/topics/${topic.id}/${prevMaterial.id}`);
            }
          }}
          disabled={currentMaterialIndex <= 0}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7m0 0l7-7" />
            </svg>
          }
        >
          Previous
        </Button>

        <Button 
          onClick={() => navigate(`/topics/${topic.id}`)}
        >
          Back to Topics
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            if (currentMaterialIndex < topic.materials.length - 1) {
              const nextMaterial = topic.materials[currentMaterialIndex + 1];
              onNavigate(nextMaterial.name, nextMaterial.startLine);
              updateLastVisited(topic.id, nextMaterial.id);
              navigate(`/topics/${topic.id}/${nextMaterial.id}`);
            }
          }}
          disabled={currentMaterialIndex >= topic.materials.length - 1}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
        >
          Next
        </Button>
      </div>

      {/* Table of Contents */}
      <TableOfContents content={content} />
    </div>
  );
};