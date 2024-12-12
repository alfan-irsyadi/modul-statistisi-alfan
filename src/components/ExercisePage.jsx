import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Paper } from '@mui/material';
import { useTimer } from 'react-timer-hook';

// Enhanced neumorphic styles
const styles = {
  container: {
    backgroundColor: '#e0e5ec',
    minHeight: '100vh',
    padding: '24px'
  },
  paper: {
    backgroundColor: '#e0e5ec',
    borderRadius: '20px',
    boxShadow: '20px 20px 60px #bec8d1, -20px -20px 60px #ffffff',
    padding: '32px',
    transition: 'all 0.3s ease'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  questionNumber: {
    color: '#2d4059',
    fontSize: '1.25rem',
    fontWeight: 500
  },
  timer: {
    color: '#ea5455',
    fontSize: '1.25rem',
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: '12px',
    boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'
  },
  question: {
    color: '#2d4059',
    fontSize: '1.1rem',
    marginBottom: '24px',
    lineHeight: 1.6
  },
  optionCard: {
    backgroundColor: '#e0e5ec',
    borderRadius: '12px',
    boxShadow: '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff',
    transition: 'all 0.3s ease',
    marginBottom: '16px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '8px 8px 15px #a3b1c6, -8px -8px 15px #ffffff'
    }
  },
  optionLabel: {
    padding: '16px',
    width: '100%',
    color: '#2d4059',
    '& .MuiRadio-root': {
      color: '#2d4059'
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
  answerCard: {
    backgroundColor: '#e0e5ec',
    borderRadius: '16px',
    boxShadow: '8px 8px 16px #bec8d1, -8px -8px 16px #ffffff',
    padding: '24px',
    marginTop: '24px'
  },
  answerTitle: {
    color: '#2d4059',
    fontSize: '1.2rem',
    fontWeight: 500,
    marginBottom: '16px'
  },
  correctAnswer: {
    color: '#ea5455',
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: '24px'
  },
  discussion: {
    color: '#2d4059',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '16px'
  },
  reference: {
    color: '#2d4059',
    fontSize: '0.9rem',
    fontStyle: 'italic'
  },
  resultCard: {
    backgroundColor: '#e0e5ec',
    borderRadius: '24px',
    boxShadow: '20px 20px 60px #bec8d1, -20px -20px 60px #ffffff',
    padding: '48px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center'
  },
  resultTitle: {
    color: '#2d4059',
    fontSize: '2rem',
    fontWeight: 500,
    marginBottom: '32px'
  },
  score: {
    color: '#ea5455',
    fontSize: '4rem',
    fontWeight: 700,
    marginBottom: '24px'
  },
  resultInfo: {
    color: '#2d4059',
    fontSize: '1.1rem',
    marginBottom: '16px'
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    gap: '16px'
  }
};

const ExercisePage = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Set timer for 30 minutes
  const time = new Date();
  time.setSeconds(time.getSeconds() + 1800);

  const {
    seconds,
    minutes,
    isRunning,
    pause
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
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowAnswer(false);
    }
  };

  const handleSubmit = () => {
    pause();
    setTimeSpent(1800 - (minutes * 60 + seconds));
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
    return <Typography sx={styles.question}>No questions available</Typography>;
  }

  if (showResults) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.resultCard}>
          <Typography sx={styles.resultTitle}>
            Exercise Results
          </Typography>
          <Typography sx={styles.score}>
            {Math.round(score)}%
          </Typography>
          <Typography sx={styles.resultInfo}>
            You answered {Object.keys(answers).length} out of {questions.length} questions
          </Typography>
          <Typography sx={styles.resultInfo}>
            Time spent: {Math.floor(timeSpent / 60)} minutes {timeSpent % 60} seconds
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              onClick={() => window.location.reload()}
              sx={styles.button}
            >
              Try Again
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== undefined;

  return (
    <Box sx={styles.container}>
      <Paper elevation={0} sx={styles.paper}>
        <Box sx={styles.header}>
          <Typography sx={styles.questionNumber}>
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Typography sx={styles.timer}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </Typography>
        </Box>

        <Typography sx={styles.question}>
          {currentQuestionData.pertanyaan}
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={answers[currentQuestion] || ''}
            onChange={handleAnswer}
          >
            <Box sx={{ display: 'grid', gap: 2 }}>
              {Object.entries(currentQuestionData.pilihan).map(([key, value]) => (
                <Paper 
                  key={key} 
                  elevation={0} 
                  sx={styles.optionCard}
                >
                  <FormControlLabel
                    value={key}
                    control={<Radio />}
                    label={value}
                    sx={styles.optionLabel}
                  />
                </Paper>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>

        {isAnswered && !showAnswer && (
          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              sx={styles.button}
              onClick={() => setShowAnswer(true)}
            >
              Show Answer
            </Button>
          </Box>
        )}

        {showAnswer && (
          <Paper elevation={0} sx={styles.answerCard}>
            <Typography sx={styles.answerTitle}>
              Answer Key
            </Typography>
            <Typography sx={styles.correctAnswer}>
              Correct Answer: {currentQuestionData.kunci_jawaban.toUpperCase()}
            </Typography>
            
            <Typography sx={styles.answerTitle}>
              Discussion
            </Typography>
            <Typography sx={styles.discussion}>
              {currentQuestionData.diskusi}
            </Typography>
            
            {currentQuestionData.referensi && (
              <>
                <Typography sx={styles.answerTitle}>
                  Reference
                </Typography>
                <Typography sx={styles.reference}>
                  {currentQuestionData.referensi}
                </Typography>
              </>
            )}
          </Paper>
        )}

        <Box sx={styles.navigationButtons}>
          <Button
            sx={{
              ...styles.button,
              opacity: currentQuestion === 0 ? 0.5 : 1
            }}
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Box>
            {currentQuestion === questions.length - 1 ? (
              <Button
                sx={{
                  ...styles.button,
                  backgroundColor: '#2d4059',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#2d4059'
                  }
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            ) : (
              <Button
                sx={styles.button}
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExercisePage;
