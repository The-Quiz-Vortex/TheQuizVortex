// Question.jsx
import { useState, useEffect, useRef, } from 'react';
import gsap from 'gsap';
import { QuizQuestion } from '../../common/interfaces.ts';

interface QuestionProps {
  data: QuizQuestion;
  selections?: (number | null)[];
  buttonText?: string;
  hasButton?: boolean;
  onQuestionButtonClick?: (value: number | null, data: QuizQuestion) => void;
  showAnswer?: boolean;
  markSelection?: number | string | null;
}

function Question({
  data,
  selections,
  buttonText,
  hasButton = true,
  onQuestionButtonClick,
  showAnswer = false,
  markSelection = null,
}: QuestionProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const parseValue = (value: string | null) => {
    if (value) {
      const values = value.split('-');
      return +values[values.length - 1];
    }
    return null
  };
  const questionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [data]);

  useEffect(() => {
    if (questionRef.current) {
      gsap.fromTo(
        questionRef.current.querySelector('.question-text'),
        {
          x: 40,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
        }
      );
      gsap.fromTo(
        questionRef.current.querySelectorAll('li'),
        {
          opacity: 0,
          x: 40,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
        }
      );
    }
  }, [data, selections]);

  console.log(answer);

  return (
    <div className="question" ref={questionRef}>
      <div className="question-inner">
        <h2 className="question-text">{data.questionTitle}</h2>
        <ul className="question-answers">
          {data.options.map((option, index) => {
            const value = `q${data.questionTitle}-${index}`;
            return (
              <li
                key={index}
                className={
                  option.isCorrect && showAnswer ? "is-true" : ""
                }
                data-selected={markSelection === index ? true : null}
              >
                <input
                  type="radio"
                  name={`q_${data.questionTitle}`}
                  value={value}
                  id={value}
                  onChange={(e) => setAnswer(e.target.value)}
                  checked={
                    !showAnswer ? answer === value : markSelection === index
                  }
                />
                <label className="question-answer" htmlFor={value}>
                  {option.optionText}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      {hasButton && (
        <button
          className="question-button"
          onClick={() => onQuestionButtonClick && onQuestionButtonClick(parseValue(answer), data)}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default Question;
