// src/utils/searchUtils.js
export const preprocessContent = (content) => {
    // Handle different input types
    if (content === null || content === undefined) {
      console.warn('Content is null or undefined');
      return '';
    }
  
    // If content is already a string, return it
    if (typeof content === 'string') {
      return content;
    }
  
    // If content is an array, convert to string
    if (Array.isArray(content)) {
      return content.map(item => {
        if (typeof item === 'object') {
          return item.content || item.text || JSON.stringify(item);
        }
        return String(item);
      }).join('\n');
    }
  
    // If content is an object, try to extract content
    if (typeof content === 'object') {
      const contentKeys = ['content', 'text', 'markdown', 'md'];
      for (let key of contentKeys) {
        if (content[key] && typeof content[key] === 'string') {
          return content[key];
        }
      }
      
      // Last resort: stringify the object
      return JSON.stringify(content);
    }
  
    // Convert to string as a fallback
    return String(content);
  };
  
  export const parseMarkdownContent = (rawContent) => {
    // Preprocess and validate content
    const content = preprocessContent(rawContent);
    
    // Validate content is a string
    if (typeof content !== 'string') {
      console.error('Invalid content type:', typeof content, content);
      return [];
    }
  
    const lines = content.split('\n');
    const documentStructure = [];
    let currentSection = null;
    let currentSubsection = null;
  
    lines.forEach((line, index) => {
      const headingMatch = line.match(/^(#+)\s*(.+)/);
      
      if (headingMatch) {
        const headingLevel = headingMatch[1].length;
        const headingText = headingMatch[2].trim();
  
        switch(headingLevel) {
          case 2:
            currentSection = {
              level: 2,
              text: headingText,
              content: [],
              subsections: []
            };
            documentStructure.push(currentSection);
            currentSubsection = null;
            break;
          
          case 3:
            if (currentSection) {
              currentSubsection = {
                level: 3,
                text: headingText,
                content: []
              };
              currentSection.subsections.push(currentSubsection);
            }
            break;
          
          case 4:
            if (currentSection) {
              currentSubsection = {
                level: 4,
                text: headingText,
                content: []
              };
              currentSection.subsections.push(currentSubsection);
            }
            break;
        }
      } else if (line.trim() && (currentSubsection || currentSection)) {
        // Collect content under current heading context
        if (currentSubsection) {
          currentSubsection.content.push(line.trim());
        } else if (currentSection) {
          currentSection.content.push(line.trim());
        }
      }
    });
  
    return documentStructure;
  };
  
  export const searchInDocumentStructure = (documentStructure, searchTerm) => {
    // Validation
    if (!Array.isArray(documentStructure)) {
      console.error('Invalid document structure:', documentStructure);
      return [];
    }
  
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const results = [];
  
    documentStructure.forEach(section => {
      // Validate section object
      if (!section || typeof section !== 'object') return;
  
      // Search in section heading
      if (section.text && section.text.toLowerCase().includes(normalizedSearchTerm)) {
        results.push({
          level: section.level,
          text: section.text,
          type: 'section-heading',
          context: (section.content || []).slice(0, 2).join(' ')
        });
      }
  
      // Search in section content
      const sectionContentMatch = (section.content || []).some(line => 
        line.toLowerCase().includes(normalizedSearchTerm)
      );
      if (sectionContentMatch) {
        results.push({
          level: section.level,
          text: section.text,
          type: 'section-content',
          context: (section.content || [])
            .filter(line => line.toLowerCase().includes(normalizedSearchTerm))
            .join(' ')
        });
      }
  
      // Search in subsections
      (section.subsections || []).forEach(subsection => {
        // Validate subsection
        if (!subsection || typeof subsection !== 'object') return;
  
        // Subsection heading search
        if (subsection.text && subsection.text.toLowerCase().includes(normalizedSearchTerm)) {
          results.push({
            level: subsection.level,
            text: subsection.text,
            type: 'subsection-heading',
            context: (subsection.content || []).slice(0, 2).join(' ')
          });
        }
  
        // Subsection content search
        const subsectionContentMatch = (subsection.content || []).some(line => 
          line.toLowerCase().includes(normalizedSearchTerm)
        );
        if (subsectionContentMatch) {
          results.push({
            level: subsection.level,
            text: subsection.text,
            type: 'subsection-content',
            context: (subsection.content || [])
              .filter(line => line.toLowerCase().includes(normalizedSearchTerm))
              .join(' ')
          });
        }
      });
    });
  
    // Sort results by relevance
    return results.sort((a, b) => {
      const typeOrder = {
        'section-heading': 1,
        'subsection-heading': 2,
        'section-content': 3,
        'subsection-content': 4
      };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  };
  
  export const highlightText = (text, searchTerm) => {
    if (!text || !searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };