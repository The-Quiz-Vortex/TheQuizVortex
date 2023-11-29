import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizById } from '../../services/quiz.services.ts';
import { useCounter } from './quiz.helper.ts';
import Question from '../Question/Question.tsx';
import QuestionCorrection from '../Question/QuestionCorrection.tsx';
import Results from '../Results/Results.tsx';
import './Quiz.scss';

function Quiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizSize, setQuizSize] = useState({});
  const { id } = useParams();
  const [quiz, setQuiz] = useState({});
  const quizRef = useRef(null);
  const questions = useRef([]);
  const selectedArr = useRef([]);
  const score = useRef(0);

  const totalQuestion = questions.current.length - 1;

  const questionCounter = useCounter(0);
  const correctCounter = useCounter(0);
  const wrongCounter = useCounter(0);
  const emptyCounter = useCounter(0);

  useEffect(() => {
    getQuizById(id).then((data) => {
      setQuiz(data);
      questions.current = [...data.questions];
    });
  }, []);

  const handleNewQuestionClick = (selectedValue, currQuestion) => {

    if (totalQuestion >= questionCounter.value) {
      if (selectedValue === currQuestion.correctAnswer) {
        selectedArr.current.push(selectedValue);
        correctCounter.add();
        score.current += currQuestion.points;
      } else if (selectedValue !== null && selectedValue !== currQuestion.correctAnswer) {
        selectedArr.current.push(selectedValue);
        wrongCounter.add();
      } else {
        selectedArr.current.push(null);
        emptyCounter.add();
      }
      questionCounter.add();
      if (totalQuestion === questionCounter.value) {
        setQuizFinished(true);
      }
    }
  };

  const resetSelection = () => {
    selectedArr.current = [];
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
    <div
      className="game"
      ref={quizRef}
      data-game-started={quizStarted ? true : null}
      data-game-finished={questionCounter.value > totalQuestion ? true : null}
    >
      <div className="intro">
        <div className="intro-inner">
          <h1 className="intro-title">{quiz.title}</h1>
          {!quizStarted && (
            <>
              <p className="intro-desc">
                {`The quiz contains ${questions.current.length} questions 
                and there is ${quiz.timeLimit > 0 ? `${quiz.timeLimit} minutes` : 'no'} time limit.`}
              </p>

              <button
                className="intro-button"
                onClick={() => setQuizStarted(true)}
              >
                Start Quiz
              </button>
            </>
          )}
          {quizStarted && (
            <div className="indicator">
              {questions.current.map((q, index) => {
                return (
                  <span
                    className="indicator-item"
                    style={{
                      backgroundColor: indicatorBg(index)
                    }}
                  />
                );
              })}
            </div>
          )}
          {quizFinished && (
            <h4 style={{marginTop: '50px'}}>{`You ${(score.current / quiz.totalPoints) > quiz.passScore ? '' : 'did not'} pass with score of ${((score.current / quiz.totalPoints) * 100).toFixed(2)}%`}</h4>
          )}
          <Results
            wrong={wrongCounter.value}
            correct={correctCounter.value}
            empty={emptyCounter.value}
          />
          <button
            className="restart-button"
            onClick={() => handleRestartClick()}
          >
            Restart Quiz
          </button>
        </div>
      </div>
      <div className="game-area">
        {questions.current[questionCounter.value] && (
          <Question
            data={questions.current[questionCounter.value]}
            selections={selectedArr.current}
            buttonText={
              questionCounter.value !== totalQuestion ? "Next Question" : "Finish Quiz"
            }
            onQuestionButtonClick={handleNewQuestionClick}
          />
        )}

        {!questions.current[questionCounter.value] && (
          <>
            <QuestionCorrection selections={selectedArr.current} questions={questions.current} />
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;
