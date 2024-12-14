// src/utils/helpers.js
export const debounce = (func, wait) => {
    let timeout;
    const executedFunction = (...args) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
    
    executedFunction.cancel = () => {
      clearTimeout(timeout);
    };
    
    return executedFunction;
  };
  
  export const findHeadingContext = (content, searchTerm) => {
    const lines = content.split('\n');
    const results = [];
    let currentHeading = { level: 0, text: '', content: '' };
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
    lines.forEach((line, index) => {
      // Detect headings
      const headingMatch = line.match(/^(#+)\s*(.+)/);
      if (headingMatch) {
        const headingLevel = headingMatch[1].length;
        const headingText = headingMatch[2].trim();
        
        // Reset current heading context
        if (headingLevel === 2) {
          currentHeading = { level: 2, text: headingText, content: '' };
        } else if (headingLevel === 3) {
          currentHeading = { level: 3, text: headingText, content: '' };
        }
      }
  
      // Check for search term in content
      if (
        currentHeading.text.toLowerCase().includes(normalizedSearchTerm) || 
        line.toLowerCase().includes(normalizedSearchTerm)
      ) {
        results.push({
          material: currentHeading.text,
          headingText: currentHeading.text,
          content: line.trim(),
          level: currentHeading.level,
          hash: currentHeading.text.toLowerCase().replace(/\s+/g, '-')
        });
      }
    });
  
    // Sort results: prioritize exact matches and higher-level headings
    return results.sort((a, b) => {
      const exactMatchA = a.material.toLowerCase() === normalizedSearchTerm ? -1 : 0;
      const exactMatchB = b.material.toLowerCase() === normalizedSearchTerm ? 1 : 0;
      return exactMatchA - exactMatchB || a.level - b.level;
    });
  };
  
  export const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };
  
  // Additional utility functions can be added here
  export const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };