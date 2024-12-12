import React, { useState } from 'react';
import { Box, TextField, List, ListItem, ListItemText, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  },
  searchField: {
    width: '100%',
    backgroundColor: '#e0e5ec',
    padding: '16px',
    color: '#2d4059',
    fontSize: '1rem',
    borderRadius: '16px',
    boxShadow: 'inset -2px -2px 8px rgba(255,255,255,1), inset 2px 2px 8px rgba(0,0,0,0.15)',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#e0e5ec',
      borderRadius: '16px',
      boxShadow: 'inset -2px -2px 8px rgba(255,255,255,1), inset 2px 2px 8px rgba(0,0,0,0.15)',
      '& fieldset': {
        border: 'none'
      },
      '&:hover fieldset': {
        border: 'none'
      },
      '&.Mui-focused fieldset': {
        border: 'none'
      }
    },
    '& .MuiOutlinedInput-input': {
      padding: '16px',
      color: '#2d4059',
      fontSize: '1rem'
    },
    '& .MuiInputAdornment-root': {
      color: '#2d4059'
    }
  },
  resultsList: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#e0e5ec',
    borderRadius: '16px',
    marginTop: '8px',
    boxShadow: '-5px -5px 10px rgba(255,255,255,0.8), 5px 5px 10px rgba(0,0,0,0.15)',
    maxHeight: '300px',
    overflow: 'auto',
    zIndex: 1000
  },
  resultItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#d1d9e6'
    }
  },
  resultTitle: {
    color: '#2d4059',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  resultContent: {
    color: '#2d4059',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    maxHeight: '2.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical'
  },
  resultTopic: {
    color: '#2d4059',
    fontSize: '0.75rem',
    marginTop: '4px'
  },
  noResults: {
    padding: '16px',
    color: '#2d4059',
    textAlign: 'center',
    fontSize: '1rem'
  }
};

const SearchBar = ({ content, onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setShowResults(term.length > 0);
  };

  const handleResultClick = (result) => {
    onResultClick(result);
    setSearchTerm('');
    setShowResults(false);
  };

  const getContentSnippet = (content, searchTerm) => {
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(searchTerm);
    if (index === -1) return content.slice(0, 100) + "...";
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + searchTerm.length + 50);
    let snippet = content.slice(start, end);
    
    if (start > 0) snippet = "..." + snippet;
    if (end < content.length) snippet = snippet + "...";
    
    return snippet;
  };

  const filteredContent = content.filter(item =>
    item.content.toLowerCase().includes(searchTerm) ||
    item.title.toLowerCase().includes(searchTerm)
  ).slice(0, 5); // Limit to 5 results

  return (
    <Box sx={styles.container}>
      <TextField
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search materials..."
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />,
        }}
        sx={styles.searchField}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      />
      {showResults && (
        <Paper sx={styles.resultsList}>
          <List>
            {filteredContent.length > 0 ? (
              filteredContent.map((result, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleResultClick(result)}
                  sx={styles.resultItem}
                >
                  <ListItemText
                    primary={
                      <div>
                        <div sx={styles.resultTitle}>{result.title}</div>
                        <div sx={styles.resultContent}>
                          {getContentSnippet(result.content, searchTerm)}
                        </div>
                        <div sx={styles.resultTopic}>
                          {result.topic}
                        </div>
                      </div>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Box sx={styles.noResults}>
                No results found
              </Box>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
