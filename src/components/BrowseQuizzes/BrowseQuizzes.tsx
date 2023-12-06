
import QuizList from '../QuizList/QuizList.tsx';
import SearchBar from '../SearchBar/SearchBar.tsx';
import { useEffect, useRef, useState } from 'react'
import { getAllQuizzes } from '../../services/quiz.services.ts';
import { Box, Flex, Input, useColorModeValue } from '@chakra-ui/react';
import Dashboard from '../Dashboard/Dashboard.tsx';
import { set } from 'lodash';

export default function BrowseQuizzes() {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const initialQuizzes = useRef([]);

    useEffect(() => {
        (async function () {
            try {
                const data = await getAllQuizzes();
                setSearchResults(data);
                initialQuizzes.current = data;
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setSearchResults(initialQuizzes.current);
            return;
        }
        const filteredResults = initialQuizzes.current.filter((quiz) => {
            return quiz.title.split(' ').some((word) => word.toLowerCase().startsWith(searchTerm.toLowerCase()));
        });
        setSearchResults(filteredResults);
    }, [searchTerm]);


    return (
        <>
            <Dashboard />
            <Box ml={{ base: 0, md: 40 }} bg={useColorModeValue('gray.50', 'gray.800')}>
                <SearchBar setSearchTerm={setSearchTerm} />
                <Flex
                    minH={'calc(100vh - 80px)'}
                    align={'center'}
                    justify={'center'}
                    pt="10"
                    pb="20"
                >
                    <QuizList quizzes={searchResults} />
                </Flex>
            </Box>
        </>
    )
}
