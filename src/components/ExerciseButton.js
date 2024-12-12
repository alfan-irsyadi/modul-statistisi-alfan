import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import ExercisePage from './ExercisePage';
import { getQuestionsForMaterial, saveExerciseResult, getExerciseResult } from '../utils/exerciseManager';

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
        variant="contained" 
        color="primary" 
        onClick={handleOpen}
        sx={{ mt: 2, mb: 2 }}
      >
        Practice Exercises
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {!started ? (
          <>
            <DialogTitle>Exercise - {materialName}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                This exercise contains {questions.length} questions.
                You will have 30 minutes to complete all questions.
              </Typography>
              {previousResult && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your previous score: {Math.round(previousResult.score)}%
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleStart} variant="contained" color="primary">
                Start Exercise
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
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
