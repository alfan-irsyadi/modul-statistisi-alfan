/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
  
    const debounced = function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  
    debounced.cancel = () => {
      clearTimeout(timeout);
    };
  
    return debounced;
  };
  /**
   * Finds matches in the text based on the search term and returns the surrounding context
   * 
   * @param {string} text - The text to search in
   * @param {string} searchTerm - The term to search for
   * @returns {Array} - Array of search results with context
   */
  
  
  /**
   * Formats a timestamp into a human-readable string
   * 
   * @param {number} timestamp - The timestamp to format
   * @returns {string} - Formatted string like "2 hours ago"
   */
  export const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
  
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return 'just now';
  };

  export const findHeadingContext = (text, searchTerm) => {
    if (!text || !searchTerm) return [];
    
    const lines = text.split('\n');
    const results = [];
    let currentTopic = '';
    let currentMaterial = '';
    let topicId = '';
    let materialId = '';
    let contextLines = 2; // Number of lines of context to include
  
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        currentTopic = line.substring(2).trim();
        topicId = currentTopic.toLowerCase().replace(/\s+/g, '-');
      } else if (line.startsWith('## ')) {
        currentMaterial = line.substring(3).trim();
        materialId = currentMaterial.toLowerCase().replace(/\s+/g, '-');
      } else if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
        // Find the nearest heading above this line
        let headingLevel = '';
        let headingText = '';
        for (let i = index; i >= 0; i--) {
          const prevLine = lines[i];
          if (prevLine.startsWith('### ')) {
            headingLevel = 'h3';
            headingText = prevLine.substring(4).trim();
            break;
          } else if (prevLine.startsWith('## ')) {
            headingLevel = 'h2';
            headingText = prevLine.substring(3).trim();
            break;
          }
        }
  
        // Get context around the matching line
        let context = '';
        for (let i = Math.max(0, index - contextLines); i <= Math.min(lines.length - 1, index + contextLines); i++) {
          if (!lines[i].startsWith('#')) {
            context += lines[i] + ' ';
          }
        }
        context = context.trim();
  
        if (currentMaterial) {
          results.push({
            topic: currentTopic,
            topicId,
            material: currentMaterial,
            materialId,
            headingText: headingText || currentMaterial,
            headingId: (headingText || currentMaterial).toLowerCase().replace(/\s+/g, '-'),
            headingLevel,
            content: context || line,
            startLine: index,
            hash: headingText ? `#${headingText.toLowerCase().replace(/\s+/g, '-')}` : ''
          });
        }
      }
    });
  
    return results.slice(0, 10); // Limit to 10 results
  };