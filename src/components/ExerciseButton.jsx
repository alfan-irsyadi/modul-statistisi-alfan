import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import ExercisePage from './ExercisePage.jsx';
import { getQuestionsForMaterial, saveExerciseResult, getExerciseResult } from '../utils/exerciseManager.jsx';

// Neumorphic styles
const styles = {
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: '#e0e5ec',
      borderRadius: '20px',
      boxShadow: '20px 20px 60px #bec8d1, -20px -20px 60px #ffffff',
      padding: '24px'
    }
  },
  button: {
    backgroundColor: '#e0e5ec',
    color: '#2d4059',
    borderRadius: '12px',
    padding: '12px 24px',
    boxShadow: '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#e0e5ec',
      boxShadow: '3px 3px 5px #a3b1c6, -3px -3px 5px #ffffff',
      transform: 'translateY(1px)'
    }
  },
  title: {
    color: '#2d4059',
    fontSize: '1.5rem',
    fontWeight: 500,
    marginBottom: '16px'
  },
  content: {
    color: '#2d4059',
    marginBottom: '24px'
  },
  score: {
    color: '#ea5455',
    fontSize: '1.1rem',
    marginTop: '8px'
  }
};

const ExerciseButton = ({ materialName }) => {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const questions = getQuestionsForMaterial(materialName);
  const previousResult = getExerciseResult(materialName);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setStarted(false);
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleComplete = (result) => {
    saveExerciseResult(materialName, result);
  };

  return (
    <>
      <Button 
        onClick={handleOpen}
        sx={styles.button}
      >
        Practice Exercises
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={styles.dialog}
      >
        {!started ? (
          <Box>
            <Typography sx={styles.title}>
              Exercise - {materialName}
            </Typography>
            <DialogContent sx={{ padding: 0 }}>
              <Typography sx={styles.content}>
                This exercise contains {questions.length} questions.
                You will have 30 minutes to complete all questions.
              </Typography>
              {previousResult && (
                <Typography sx={styles.score}>
                  Your previous score: {Math.round(previousResult.score)}%
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ padding: '24px 0 0 0' }}>
              <Button onClick={handleClose} sx={styles.button}>
                Cancel
              </Button>
              <Button onClick={handleStart} sx={{
                ...styles.button,
                backgroundColor: '#2d4059',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#2d4059',
                  boxShadow: '3px 3px 5px #a3b1c6, -3px -3px 5px #ffffff',
                  transform: 'translateY(1px)'
                }
              }}>
                Start Exercise
              </Button>
            </DialogActions>
          </Box>
        ) : (
          <DialogContent sx={{ padding: 0 }}>
            <ExercisePage 
              questions={questions}
              onComplete={handleComplete}
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default ExerciseButton;
