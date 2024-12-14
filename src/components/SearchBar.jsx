// src/components/SearchBar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { debounce, findHeadingContext } from '../utils/helpers';

export const SearchBar = ({ content, onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  const performSearch = useCallback((term) => {
    console.log('this is performSearch', term)
    if (!term.trim()) {
      setResults([]);
      return;
    }

    // Process the content correctly whether it's an array or a single string
    console.log('content', content)
    const contentText = Array.isArray(content) 
      ? content.map(item => item.content).join('\n')
      : content;

    const searchResults = findHeadingContext(contentText, term);
    setResults(searchResults);
  }, [content]);

  const handleSearch = useCallback(
    debounce((term) => performSearch(term), 300),
    [performSearch]
  );

  useEffect(() => {
    console.log(searchTerm)
    handleSearch(searchTerm);
    return () => handleSearch.cancel?.();
  }, [searchTerm, handleSearch]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search materials..."
          className="w-full px-4 py-2 rounded-xl bg-white shadow-inner"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>

      {showResults && (searchTerm.trim() !== '') && (
        <div 
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg"
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          {results.length > 0 ? (
            <div className="py-1">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    onResultClick(result);
                    setShowResults(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="font-semibold text-sm text-gray-800">
                    {result.material}
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.headingText}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-700">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};