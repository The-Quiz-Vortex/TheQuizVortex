import { useState, useEffect } from 'react'
import { getAllQuizzes } from '../../services/quiz.services.ts';
import { Box, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Quiz } from '../../common/interfaces.ts';


export default function QuizList() {

    const [quizzes, setQuizzes] = useState([] as Quiz[]);


    useEffect(() => {

        
        const fetchQuizzes = async () => {
            const quizzesData = await getAllQuizzes();
           quizzesData && setQuizzes(quizzesData);
        };

        fetchQuizzes();
    }, []);

console.log(quizzes);

    return (
        <Box>
            {quizzes.map((quiz, index) => (
                <Box key={index} p={5} shadow="md" borderWidth="1px">
                    <Heading fontSize="xl">{quiz.title}</Heading>
                    <Text mt={4}>{quiz.author}</Text>
                    <Link to={`/quiz/${quiz.quizId}`}>View Quiz</Link>
                    {/* Add more fields as needed */}
                </Box>
            ))}
        </Box>
    );
}
