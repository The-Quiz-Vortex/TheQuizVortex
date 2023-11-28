// QuizApp.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { getQuizById } from '../../services/quiz.services.ts';
import { useCounter } from './quiz.helper.ts';
import Question from '../Question/Question.tsx';

function QuizApp() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizSize, setQuizSize] = useState({});
  const { id } = useParams();
  const [quiz, setQuiz] = useState({});
  const quizRef = useRef(null);
  const questions = useRef([]);
  const selectedArr = useRef([]);

  const totalQuestion = questions.current.length - 1;

  const questionCounter = useCounter(0);
  const correctCounter = useCounter(0);
  const wrongCounter = useCounter(0);
  const emptyCounter = useCounter(0);

  useEffect(() => {
    getQuizById(id).then((data) => {
      setQuiz(data);
      questions.current = data.questions;
    });
  }, []);

  const handleNewQuestionClick = (selectedValue, currQuestion) => {
    if (totalQuestion >= questionCounter.value) {
      if (currQuestion.isCorrect) {
        selectedArr.current.push(null);
        correctCounter.add();
      } else if (selectedValue !== null && selectedValue !== currQuestion.correct) {
        selectedArr.current.push(selectedValue);
        wrongCounter.add();
      } else {
        selectedArr.current.push(selectedValue);
        emptyCounter.add();
      }
      questionCounter.add();
    }
  };

  const resetSelection = () => {
    selectedArr.current = [];
    correctCounter.reset();
    wrongCounter.reset();
    emptyCounter.reset();
  };

  const handleRestartClick = () => {
    setQuizFinished(false);
    setQuizStarted(false);
    resetSelection();
    questionCounter.reset();
    correctCounter.reset();
    wrongCounter.reset();
    emptyCounter.reset();
  };

  const indicatorBg = (index) => {
    if (questionCounter.value > index) {
      return '#fff';
    } else if (questionCounter.value === index) {
      return '#29b5d5';
    } else {
      return 'rgba(255,255,255,.2)';
    }
  };

  useEffect(() => {
    if (quizStarted) {
      document.body.classList.add('quiz-started');
    } else {
      document.body.classList.remove('quiz-started');
    }
  }, [quizStarted]);

  useEffect(() => {
    if (questionCounter.value > totalQuestion) {
      quizRef.current.scrollTop = 0;
    }
  }, [questionCounter.value]);

  return (
    <Box
      className="quiz"
      ref={quizRef}
      data-quiz-started={quizStarted ? true : null}
      data-quiz-finished={questionCounter.value > totalQuestion ? true : null}
    >
      <Box className="intro">
        <Box className="intro-inner">
          <Text className="intro-title">CSS Quiz</Text>
          {!quizStarted && (
            <>
              <Text className="intro-desc">{`The test contains ${questions.current.length} questions and there is no time limit.`}</Text>
              <Button className="intro-button" onClick={() => setQuizStarted(true)}>
                Start Quiz
              </Button>
            </>
          )}
          {quizStarted && (
            <Box className="indicator">
              {questions.current.map((q, index) => (
                <Box
                  key={index}
                  className="indicator-item"
                  backgroundColor={indicatorBg(index)}
                />
              ))}
            </Box>
          )}
          {/* <Box className="result">
            <Box className="result-item is-correct">
              <Text className="result-count">{correctCounter.value}</Text>
              <Text className="result-text">CORRECT</Text>
            </Box>
            <Box className="result-item is-wrong">
              <Text className="result-count">{wrongCounter.value}</Text>
              <Text className="result-text">WRONG</Text>
            </Box>
            <Box className="result-item is-empty">
              <Text className="result-count">{emptyCounter.value}</Text>
              <Text className="result-text">EMPTY</Text>
            </Box>
          </Box> */}
          <Button className="restart-button" onClick={handleRestartClick}>
            Restart Quiz
          </Button>
        </Box>
      </Box>
      <Box className="quiz-area">
        {questions.current[questionCounter.value] && (
          <Question
            data={questions.current[questionCounter.value]}
            buttonText={
              questionCounter.value !== totalQuestion ? 'Next Question' : 'Finish Quiz'
            }
            onQuestionButtonClick={handleNewQuestionClick}
          />
        )}
        {!questions.current[questionCounter.value] && (
          <>
            {questions.current.map((q, index) => (
              <Question
                key={q.quizId}
                hasButton={false}
                markSelection={selectedArr.current[index]}
                showAnswer
                data={q}
              />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}

export default QuizApp;
