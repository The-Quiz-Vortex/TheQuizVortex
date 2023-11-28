// Question.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Button, VStack, Radio } from '@chakra-ui/react';
import gsap from 'gsap';

function Question({
  data,
  buttonText,
  hasButton = true,
  onQuestionButtonClick,
  showAnswer = false,
  markSelection = null,
}) {
  const [answer, setAnswer] = useState(null);
  const parseValue = (value) => (value ? parseInt(value.split('-')[1]) : null);
  const questionRef = useRef(null);

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
  }, [data]);

  return (
    <Box className="question" ref={questionRef} display="flex" flexDirection="column" width="100%">
      <Box className="question-inner" margin="auto 0">
        <Text className="question-text" color="#333" margin="20px 0" fontSize="18px">
          {data.questionTitle}
        </Text>
        <VStack spacing="10px">
          {data.options.map((option, index) => {
            const value = `q${data.quizId}-${index}`;
            return (
              <Radio
                key={index}
                className={option.isCorrect && showAnswer ? 'is-true' : ''}
                isChecked={!showAnswer ? answer === value : markSelection === index}
                value={value}
                onChange={() => setAnswer(value)}
                colorScheme="teal"
              >
                {option.optionText}
              </Radio>
            );
          })}
        </VStack>
      </Box>
      {hasButton && (
        <Button
          className="question-button"
          onClick={() => onQuestionButtonClick(parseValue(answer), data)}
          backgroundColor="#1f8197"
          color="#fff"
          border="0"
          padding="14px 26px"
          borderRadius="4px"
          marginTop="20px"
          fontSize="16px"
          cursor="pointer"
          fontWeight="500"
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
}

export default Question;
