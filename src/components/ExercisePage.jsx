import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

const styles = {
  container: "min-h-screen p-8 bg-[#e0e5ec]",
  card: "max-w-4xl mx-auto p-8 bg-[#e0e5ec] rounded-2xl shadow-[-10px_-10px_20px_rgba(255,255,255,0.8),10px_10px_20px_rgba(0,0,0,0.15)]",
  header: "flex justify-between items-center mb-8",
  timer: "text-2xl font-light text-gray-700",
  progress: "text-lg text-gray-600",
  question: "text-xl text-gray-800 font-medium mb-6",
  optionsContainer: "space-y-4",
  option: "w-full text-left px-6 py-4 bg-[#e0e5ec] rounded-xl text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
  optionSelected: "shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
  navigationContainer: "flex justify-between mt-8",
  button: "px-8 py-3 bg-[#e0e5ec] rounded-xl text-gray-700 transition-all duration-300 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed",
  resultContainer: "text-center",
  resultScore: "text-6xl font-bold text-gray-800 mb-4",
  resultStats: "text-lg text-gray-600 mb-8",
  resultDetails: "space-y-6 mt-8",
  questionResult: "p-6 bg-[#e0e5ec] rounded-xl shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)]",
  discussion: "mt-4 p-4 bg-[#e0e5ec] rounded-xl shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.8),inset_3px_3px_6px_rgba(0,0,0,0.15)]",
  discussionTitle: "font-medium text-gray-800 mb-2",
  discussionText: "text-gray-600",
  reference: "text-sm text-gray-500 italic mt-2",
  correctAnswer: "text-green-600 font-medium",
  incorrectAnswer: "text-red-600 font-medium",
};

const ExercisePage = ({ questions = [], onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 3600);

  const { seconds, minutes, start, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => handleComplete(),
    autoStart: true
  });

  useEffect(() => {
    if (showResult) {
      pause();
    }
  }, [showResult, pause]);

  const handleAnswerSelect = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleComplete = () => {
    const timeSpentInSeconds = 3600 - (minutes * 60 + seconds);
    setTimeSpent(timeSpentInSeconds);

    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.kunci_jawaban) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setShowResult(true);

    if (onComplete) {
      onComplete({
        score,
        timeSpent: timeSpentInSeconds,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        answers
      });
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className="text-xl text-gray-700 text-center">No questions available for this material.</p>
          <button className={styles.button} onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correctCount = questions.reduce((count, question, index) => 
      answers[index] === question.kunci_jawaban ? count + 1 : count, 0);
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.resultContainer}>
            <div className={styles.resultScore}>{score}%</div>
            <div className={styles.resultStats}>
              <p>Correct Answers: {correctCount} out of {questions.length}</p>
              <p>Time Spent: {formatTime(timeSpent)}</p>
            </div>
            <div className={styles.resultDetails}>
              {questions.map((question, index) => (
                <div key={index} className={styles.questionResult}>
                  <p className="text-lg text-gray-800 mb-3">Question {index + 1}</p>
                  <p className="text-gray-700 mb-4">{question.pertanyaan}</p>
                  <p className={answers[index] === question.kunci_jawaban ? styles.correctAnswer : styles.incorrectAnswer}>
                    Your Answer: {question.pilihan[answers[index]]}
                  </p>
                  {answers[index] !== question.kunci_jawaban && (
                    <p className={styles.correctAnswer}>
                      Correct Answer: {question.pilihan[question.kunci_jawaban]}
                    </p>
                  )}
                  <div className={styles.discussion}>
                    <p className={styles.discussionTitle}>Discussion:</p>
                    <p className={styles.discussionText}>{question.diskusi}</p>
                    {question.referensi && (
                      <p className={styles.reference}>Reference: {question.referensi}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className={`${styles.button} mt-8`} onClick={onBack}>
              Back to Material
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.timer}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className={styles.progress}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        <div className={styles.question}>{currentQuestion.pertanyaan}</div>

        <div className={styles.optionsContainer}>
          {Object.entries(currentQuestion.pilihan).map(([key, value]) => (
            <button
              key={key}
              className={`${styles.option} ${answers[currentQuestionIndex] === key ? styles.optionSelected : ''}`}
              onClick={() => handleAnswerSelect(key)}
            >
              {key.toUpperCase()}. {value}
            </button>
          ))}
        </div>

        {answers[currentQuestionIndex] && (
          <div className="mt-8 space-y-6">
            <div className={styles.discussion}>
              <h3 className={styles.discussionTitle}>Kunci Jawaban</h3>
              <p className={`${styles.discussionText} ${answers[currentQuestionIndex] === currentQuestion.kunci_jawaban ? 'text-green-600' : 'text-red-600'}`}>
                {answers[currentQuestionIndex] === currentQuestion.kunci_jawaban ? '✓ Benar!' : '✗ Salah.'}
                {' '}Jawaban yang benar adalah: {currentQuestion.kunci_jawaban.toUpperCase()}. {currentQuestion.pilihan[currentQuestion.kunci_jawaban]}
              </p>
            </div>

            <div className={styles.discussion}>
              <h3 className={styles.discussionTitle}>Pembahasan</h3>
              <p className={styles.discussionText}>{currentQuestion.diskusi}</p>
            </div>

            {currentQuestion.referensi && (
              <div className={styles.discussion}>
                <h3 className={styles.discussionTitle}>Referensi</h3>
                <p className={styles.discussionText}>{currentQuestion.referensi}</p>
              </div>
            )}
          </div>
        )}

        <div className={styles.navigationContainer}>
          <button
            className={styles.button}
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className={styles.button}
            onClick={handleNext}
            disabled={!answers[currentQuestionIndex]}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
