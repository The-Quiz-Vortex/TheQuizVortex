import { useState, useEffect } from 'react';
import { getAllQuizzes } from '../../services/quiz.services.ts';
import {
  Heading,
  Box,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Quiz } from '../../common/interfaces.ts';
import Dashboard from '../Dashboard/Dashboard.tsx';
import { format } from 'date-fns';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([] as Quiz[]);

  //   console.log(quizzes);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzesData = await getAllQuizzes();
      quizzesData && setQuizzes(quizzesData);
    };

    fetchQuizzes();
  }, []);

  //   console.log(quizzes);

  return (
    <>
      <Dashboard />
      <Box minH="calc(100vh - 140px)" ml={{ base: 0, md: 60 }}>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
          pt="20"
          pb="20"
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mx={{ base: 4, md: 8 }}>
            {quizzes.map((quiz, index) => (
              <Box
                key={index}
                maxW={'270px'}
                w={'full'}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}
              >
                <Image
                  h={'120px'}
                  w={'full'}
                  src={
                    'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
                  }
                  objectFit="cover"
                  alt="#"
                />

                <Box p={6}>
                  {quiz.categories.map((category, index) => (
                    <Badge key={index} px={2} py={1} m={1} fontWeight={'400'}>
                      #{category}
                    </Badge>
                  ))}
                  <Stack spacing={0} align={'center'} mb={5} minHeight={'100px'}>
                    <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                      {quiz.title}
                    </Heading>
                    <Text color={'gray.500'} pt="3">
                      {quiz.author}
                    </Text>
                  </Stack>

                  <Stack direction={'row'} justify={'center'} spacing={6}>
                    <Stack spacing={0} align={'center'}>
                      <Text fontWeight={600}>{quiz.questions.length}</Text>
                      <Text fontSize={'sm'} color={'gray.500'}>
                        Questions
                      </Text>
                    </Stack>
                    <Stack spacing={0} align={'center'}>
                      <Text fontWeight={600}>
                        {`${Math.floor(quiz.timeLimit / 60)}h ${quiz.timeLimit % 60}m`}
                      </Text>
                      <Text fontSize={'sm'} color={'gray.500'}>
                        Time Limit
                      </Text>
                    </Stack>
                  </Stack>

                  <Link to={`/quiz/${quiz.quizId}`}>
                    <Button
                      w={'full'}
                      mt={8}
                      rounded={'md'}
                      fontWeight={600}
                      color={'white'}
                      bg={'pink.400'}
                      _hover={{
                        transform: 'translateY(-2px)',
                        bg: 'pink.300',
                        boxShadow: 'lg',
                      }}
                    >
                      View Quiz
                    </Button>
                  </Link>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>
    </>
  );
}
