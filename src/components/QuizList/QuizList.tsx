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
import { useUserContext } from '../../helpers/useUserContext.ts';
import { updateQuiz, deleteQuizById } from '../../services/quiz.services.ts';
import React, { useContext, useState } from 'react'; // Import useState
import { AuthContext } from '../../context/AuthContext.tsx';
import { FiLock } from 'react-icons/fi';

export default function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  const { appState } = useUserContext();
  const {user} = useContext(AuthContext);
  const [quizzesState, setQuizzes] = useState<Quiz[]>(quizzes);

  const canEditOrDelete = (quizAuthor: string) => {
    return appState.isAdmin || appState.userData?.username === quizAuthor;
  };

   const handleEdit = async (quizId: string, quizAuthor: string) => {
    if (canEditOrDelete(quizAuthor)) {
      try {
        // Call the updateQuiz function from the service
        const updatedQuiz = await updateQuiz(quizId);

        console.log(`Editing quiz with ID ${quizId}`);
        // Add any additional logic or navigation here
      } catch (error) {
        console.error('Error editing quiz:', error);
      }
    } else {
      console.log('You do not have permission to edit this quiz.');
    }
  };

  const handleDelete = async (quizId: string, quizAuthor: string) => {
    if (canEditOrDelete(quizAuthor)) {
      if (window.confirm('Are you sure you want to delete this quiz?')) {
        try {
          // Call the deleteQuizById function from the service
          await deleteQuizById(quizId);
  
          // Update the state to remove the deleted quiz from the UI
          setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.quizId !== quizId));
  
          console.log(`Deleting quiz with ID ${quizId}`);
          // Add any additional logic or navigation here
        } catch (error) {
          console.error('Error deleting quiz:', error);
        }
      }
    } else {
      console.log('You do not have permission to delete this quiz.');
    }
  };

  return (
    <>
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

              <Link to={!user ? '#' : `/quiz/${quiz.quizId}`}>
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
                  Take Quiz
                  {!user && <FiLock style={{ marginLeft: '10px', fontSize: '12px' }} />}
                </Button>
              </Link>

              {(canEditOrDelete(quiz.author) || appState.isAdmin) && (
                <Stack spacing={6}>
                  <Button
                    w={'full'}
                    mt={2}
                    rounded={'md'}
                    fontWeight={600}
                    color={'white'}
                    bg={'blue.400'}
                    _hover={{
                      transform: 'translateY(-2px)',
                      bg: 'blue.300',
                      boxShadow: 'lg',
                    }}
                    onClick={() => handleEdit(quiz.quizId, quiz.author)}
                  >
                    Edit
                  </Button>
                  <Button
                    w={'full'}
                    mt={2}
                    rounded={'md'}
                    fontWeight={600}
                    color={'white'}
                    bg={'red.400'}
                    _hover={{
                      transform: 'translateY(-2px)',
                      bg: 'red.300',
                      boxShadow: 'lg',
                    }}
                    onClick={() => handleDelete(quiz.quizId, quiz.author)}
                  >
                    Delete
                  </Button>
                </Stack>
              )}
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
}
