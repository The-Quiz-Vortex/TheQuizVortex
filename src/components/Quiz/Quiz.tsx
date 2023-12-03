import { useRef, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizById } from '../../services/quiz.services.ts';
import { useCounter } from './quiz.helper.ts';
import Question from '../Question/Question.tsx';
import QuestionCorrection from '../Question/QuestionCorrection.tsx';
import Results from '../Results/Results.tsx';
import './Quiz.scss';
import { saveQuizResult } from '../../services/quizResult.services.ts';
import { AuthContext } from '../../context/AuthContext.tsx';
import { Quiz as QuizInterface, QuizQuestion } from '../../common/interfaces.ts';
import { NOW_IN_MS } from '../../common/constants.ts';
import CountDownTimer from '../CountDownTimer/CountDownTimer.tsx';

function Quiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizInterface>({} as QuizInterface);
  const quizRef = useRef<HTMLDivElement | null>(null);
  const questions = useRef<QuizQuestion[]>([]);
  const selectedArr = useRef<(number | null)[]>([]);
  const score = useRef(0);
  const { userData } = useContext(AuthContext);
  const [timer, setTimer] = useState(0);
  const [remainingQ, setRemainingQ] = useState(0);

  const totalQuestion = questions.current.length - 1;

  const questionCounter = useCounter(0);
  const correctCounter = useCounter(0);
  const wrongCounter = useCounter(0);
  const emptyCounter = useCounter(0);
  
  useEffect(() => {

    const fetchQuiz = async () => {
      try {
        if (id) {
          const data = await getQuizById(id);
          setQuiz(data);
          questions.current = [...data.questions];
          const convertedTimerToMs = data.timeLimit * 60 * 1000;
          const dateTimeAfterTimer = NOW_IN_MS + convertedTimerToMs;
          setTimer(dateTimeAfterTimer);
          setRemainingQ(data.questions.length);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (quizFinished && userData) {
      (async () => {
        console.log('here');
        if (quizFinished && quizRef.current) {
          quizRef.current.scrollTop = 0;
        }

        selectedArr.current = selectedArr.current.concat(Array(remainingQ).fill(null));
        emptyCounter.set(emptyCounter.value + remainingQ);
        questionCounter.set(totalQuestion);
        await saveQuizResult(
          selectedArr.current,
          quiz.quizId,
          userData?.username,
          score.current,
          parseFloat(((score.current / quiz.totalPoints) * 100).toFixed(2)));
      })();
    }
  }, [quizFinished])

  const handleNewQuestionClick = async (selectedValue: number | null, currQuestion: QuizQuestion) => {

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
      setRemainingQ(remainingQ - 1);
      if (totalQuestion === questionCounter.value && userData) {
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

  const indicatorBg = (index: number) => {
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
  
  return (
    <div className='quizPage'>
      <div
        className="game"
        ref={quizRef}
        data-game-started={quizStarted ? true : null}
        data-game-finished={questionCounter.value > totalQuestion || quizFinished ? true : null}
      >
        <div className="intro">
          <div className="intro-inner">
            <h1 className="intro-title">{quiz.title}</h1>
            {quizStarted && timer > 0 && (
              <CountDownTimer
                targetDate={timer}
                quizFinished={quizFinished}
                setQuizFinished={setQuizFinished} />)}
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
              <h4 style={{ marginTop: '50px' }}>
                {`You ${(score.current / quiz.totalPoints) > quiz.passScore ? '' : 'did not'} 
                pass with score of ${((score.current / quiz.totalPoints) * 100).toFixed(2)}%`}
              </h4>
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
          {quizStarted && !quizFinished && (
            <Question
              data={questions.current[questionCounter.value]}
              selections={selectedArr.current}
              buttonText={
                questionCounter.value !== totalQuestion ? "Next Question" : "Finish Quiz"
              }
              onQuestionButtonClick={handleNewQuestionClick}
            />
          )}

          {quizFinished && (
            <>
              <QuestionCorrection selections={selectedArr.current} questions={questions.current} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
