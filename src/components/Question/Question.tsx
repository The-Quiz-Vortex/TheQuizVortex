// Question.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Button, VStack, Radio } from '@chakra-ui/react';
import gsap from 'gsap';

function Question({
  data,
  selections,
  buttonText,
  hasButton = true,
  onQuestionButtonClick,
  showAnswer = false,
  markSelection = null,
}) {
  const [answer, setAnswer] = useState(null);
  const parseValue = (value) => (value ? parseInt(value.split('-')[1]) : null);
  const questionRef = useRef(null);

  console.log(markSelection);
  
  useEffect(() => {
    setAnswer(null);
  }, [data]);

  useEffect(() => {
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
  }, [data, selections]);

  return (
    <div className="question" ref={questionRef}>
      <div className="question-inner">
        <h2 className="question-text">{data.questionTitle}</h2>
        <ul className="question-answers">
          {data.options.map((option, index) => {
            const value = `q${data.quizId}-${index}`;
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
                  name={`q_${data.quizId}`}
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
          onClick={() => onQuestionButtonClick(parseValue(answer), data)}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default Question;
