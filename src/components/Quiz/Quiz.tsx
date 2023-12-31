import { useRef, useState, useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getQuizById } from '../../services/quiz.services.ts';
import { useCounter } from './quiz.helper.ts';
import Question from '../Question/Question.tsx';
import QuestionCorrection from '../Question/QuestionCorrection.tsx';
import Results from '../Results/Results.tsx';
import './Quiz.scss';
import { getQuizResultId, saveQuizResult } from '../../services/quizResult.services.ts';
import { AuthContext } from '../../context/AuthContext.tsx';
import { Quiz as QuizInterface, QuizQuestion } from '../../common/interfaces.ts';
import CountDownTimer from '../CountDownTimer/CountDownTimer.tsx';

function Quiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const review = queryParams.get("review");
  const [quiz, setQuiz] = useState<QuizInterface>({} as QuizInterface);
  const quizRef = useRef<HTMLDivElement | null>(null);
  const questions = useRef<QuizQuestion[]>([]);
  const selectedArr = useRef<(number | null)[]>([]);
  const score = useRef(0);
  const { userData } = useContext(AuthContext);
  const [timer, setTimer] = useState(0);
  const [remainingQ, setRemainingQ] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalQuestion = questions.current.length - 1;

  const questionCounter = useCounter(0);
  const correctCounter = useCounter(0);
  const wrongCounter = useCounter(0);
  const emptyCounter = useCounter(0);

  console.log(quiz);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchQuiz = async () => {
      try {
        if (id) {
          const data = await getQuizById(id);
          setQuiz(data);
          questions.current = [...data.questions];

          setRemainingQ(data.questions.length);
          if (review) {

            setQuizStarted(true);
            setQuizFinished(true);
            const selected = await getQuizResultId(review);
            selectedArr.current.length === 0 && selected.selection.forEach((answer, index) => {
              if (answer === null) {
                emptyCounter.add();
              } else {
                if (answer === data.questions[index].correctAnswer) {
                  correctCounter.add();
                } else {
                  wrongCounter.add();
                }
              }
            });
            
            selectedArr.current = selected.selection;
            score.current = selected.scorePoints;
            setIsCompleted(true);

          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (quiz.timeLimit !== 0) {
      const convertedTimerToMs = quiz.timeLimit * 60 * 1000;
      const dateTimeAfterTimer = new Date().getTime() + convertedTimerToMs;
      setTimer(dateTimeAfterTimer);
    }
  }, [quizStarted]);

  useEffect(() => {
    if (quizFinished && userData && quiz.quizId !== "-NlYeBjFsgGD1ri34R0u" && !review) {

      (async () => {

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
      setIsCompleted(true);
    }
  }, [quizFinished])

  const handleNewQuestionClick = async (selectedValue: number | null, currQuestion: QuizQuestion) => {

    if (totalQuestion >= questionCounter.value && !isCompleted) {
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
  console.log(score.current / quiz.totalPoints);
  console.log(quiz.totalPoints);



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
                and there is ${quiz.timeLimit > 0 ? `${quiz.timeLimit} minutes` : 'no'} time limit. `}
                  {quiz.quizId === "-NlYeBjFsgGD1ri34R0u" && `This is a sample quiz and your answers will not be saved.`}
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
                {`You ${((score.current / quiz.totalPoints) * 100) >= quiz.passingScore ? '' : 'did not'} 
                pass with score of ${((score.current / quiz.totalPoints) * 100).toFixed(2)}%`}
              </h4>
            )}
            <Results
              wrong={wrongCounter.value}
              correct={correctCounter.value}
              empty={emptyCounter.value}
            />
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
