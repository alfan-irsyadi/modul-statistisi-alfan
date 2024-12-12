import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Paper, CircularProgress } from '@mui/material';
import { useTimer } from 'react-timer-hook';

const ExercisePage = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Set timer for 30 minutes
  const time = new Date();
  time.setSeconds(time.getSeconds() + 1800);

  const {
    seconds,
    minutes,
    isRunning,
    pause,
    resume,
  } = useTimer({ 
    expiryTimestamp: time, 
    onExpire: () => handleSubmit()
  });

  const handleAnswer = (event) => {
    setAnswers({
      ...answers,
      [currentQuestion]: event.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.kunci_jawaban) {
        correctAnswers++;
      }
    });
    setScore((correctAnswers / questions.length) * 100);
    setShowResults(true);
    if (onComplete) {
      onComplete({
        score: (correctAnswers / questions.length) * 100,
        answers,
        timeSpent: 1800 - (minutes * 60 + seconds)
      });
    }
  };

  if (!questions || questions.length === 0) {
    return <Typography>No questions available</Typography>;
  }

  if (showResults) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Exercise Results</Typography>
          <Typography variant="h2" color="primary" gutterBottom>{Math.round(score)}%</Typography>
          <Typography variant="body1" gutterBottom>
            You answered {Object.keys(answers).length} out of {questions.length} questions
          </Typography>
          <Typography variant="body1" gutterBottom>
            Time spent: {Math.floor((1800 - (minutes * 60 + seconds)) / 60)} minutes {(1800 - (minutes * 60 + seconds)) % 60} seconds
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Typography variant="h6" color="primary">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </Typography>
        </Box>

        <Typography variant="body1" gutterBottom>
          {questions[currentQuestion].pertanyaan}
        </Typography>

        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <RadioGroup
            value={answers[currentQuestion] || ''}
            onChange={handleAnswer}
          >
            {Object.entries(questions[currentQuestion].pilihan).map(([key, value]) => (
              <FormControlLabel
                key={key}
                value={key}
                control={<Radio />}
                label={value}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
            color={currentQuestion === questions.length - 1 ? "success" : "primary"}
          >
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExercisePage;
