import React from 'react';

const styles = {
  button: {
    backgroundColor: '#e0e5ec',
    color: '#2d4059',
    fontSize: '1rem',
    fontWeight: 600,
    padding: '16px',
    borderRadius: '16px',
    textTransform: 'none',
    boxShadow: '-5px -5px 10px rgba(255,255,255,0.8), 5px 5px 10px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '-8px -8px 15px rgba(255,255,255,0.8), 8px 8px 15px rgba(0,0,0,0.15)'
    }
  }
};

const ExerciseButton = ({ materialName, onClick, children, ...props }) => {
  if (!materialName) {
    return null;
  }

  return (
    <button
      style={styles.button}
      onClick={onClick}
      {...props}
    >
      {children || 'Practice Exercises'}
    </button>
  );
};

export default ExerciseButton;
