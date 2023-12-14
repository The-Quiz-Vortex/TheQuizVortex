import QuizList from '../QuizList/QuizList.tsx';
import SearchBar from '../SearchBar/SearchBar.tsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { getAllQuizzes } from '../../services/quiz.services.ts';
import { Box, Flex, Heading, useColorModeValue, Text, Stack } from '@chakra-ui/react';
import Dashboard from '../Dashboard/Dashboard.tsx';
import { Quiz } from '../../common/interfaces.ts';
import { AuthContext } from '../../context/AuthContext.tsx';

export default function BrowseQuizzes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Quiz[]>([]);
  const initialQuizzes = useRef<Quiz[]>([]);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    (async function () {
      try {
        const data = await getAllQuizzes();
        const filtered =
          data?.filter(
            (quiz) =>
              quiz.visibility === 'public' ||
              quiz.author === userData?.username ||
              (quiz.visibility === 'private' && quiz.users?.includes(userData?.username))
          ) || [];
        setSearchResults(filtered);
        initialQuizzes.current = filtered;
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
      return quiz.title
        .split(' ')
        .some((word) => word.toLowerCase().startsWith(searchTerm.toLowerCase()));
    });
    setSearchResults(filteredResults);
  }, [searchTerm]);

  return (
    <>
      <Dashboard />
      <Box ml={{ base: 0, md: 40 }} pt={16} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Flex direction={'column'} alignItems={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'} my={'2'}>
            Browse popular{' '}
            <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
              Quizzes
            </Text>
          </Heading>
          <Text
            fontSize={'lg'}
            color={'gray.500'}
            mt={'0'}
            mb={'10'}
            mx={'0 auto'}
            width={{ base: '100%', md: '770px' }}
          >
            Dive into our collection of popular quizzes. From brain teasers to knowledge challenges,
            find the perfect quiz to spark curiosity and fun. Discover, play, and test your skills
            with our curated selection of engaging quizzes. ✌️
          </Text>
        </Flex>
        <SearchBar setSearchTerm={setSearchTerm} />
        <Flex minH={'calc(100vh - 80px)'} align={'center'} justify={'center'} pt="10" pb="20">
          <QuizList quizzes={searchResults} />
        </Flex>
      </Box>
    </>
  );
}
