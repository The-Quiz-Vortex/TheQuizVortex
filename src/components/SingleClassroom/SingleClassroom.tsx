import {
  Flex,
  Feature,
  useColorModeValue,
  Heading,
  Stack,
  Box,
  Text,
  Icon,
  SimpleGrid,
  StackDivider,
  Image,
  Divider,
  Avatar,
  Badge,
  Button,
} from '@chakra-ui/react';
import Dashboard from '../Dashboard/Dashboard';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSingleClassroom } from '../../services/rooms.services';
import { Classroom, QuizResult, Student } from '../../common/interfaces'; // assuming you have a Student interface
import { FiLock, FiUser } from 'react-icons/fi';
import { useUserContext } from '../../helpers/useUserContext';
import { AuthContext } from '../../context/AuthContext.tsx';
import { Quiz } from '../../common/interfaces.ts';
import { deleteQuizById, getAllQuizzes, updateQuiz } from '../../services/quiz.services.ts';
import { getQuizResultsByUsername } from '../../services/quizResult.services.ts';

export default function SingleClassroom() {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { appState } = useUserContext();
  const { user, userData } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  let { classRoomName } = useParams();
  classRoomName = classRoomName?.split('-').join(' ') || '';

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const classroomData = await getSingleClassroom(classRoomName);

        setClassroom(classroomData || null);

        // Convert the students object into an array
        if (classroomData?.students) {
          const studentsArray = Object.keys(classroomData.students).map((id) => ({
            id,
            ...classroomData.students[id],
          }));
          setStudents(studentsArray);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClassroom();

    const fetchData = async () => {
      try {
        // Fetch quizzes using getAllQuizzes
        const fetchedQuizzes = await getAllQuizzes();
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchData();
  }, [classRoomName, userData]);

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

  if (!classroom) {
    return <div>Classroom not found</div>;
  }

  return (
    <>
      <Dashboard />

      <Box ml={{ base: 0, md: 60 }}>
        <Flex
          minH={'calc(100vh - 80px)'}
          align={'center'}
          justify={'center'}
          flexDirection={'column'}
          bg={'gray.50'}
        >
          <Stack
            spacing={4}
            w={'full'}
            maxW={'90%'}
            bg={'white'}
            rounded={'xl'}
            boxShadow={'lg'}
            p={10}
            my={6}
          >
            <Stack spacing={4}>
              <Heading fontSize={'4xl'} textAlign={'left'} my={'2'}>
                Classroom:{' '}
                <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                  {classroom.classRoomName}
                </Text>
              </Heading>
              <Text
                fontSize={'md'}
                bg={'gray.100'}
                p={2}
                display={'flex'}
                alignSelf={'flex-start'}
                alignItems={'center'}
                rounded={'md'}
                gap={1}
              >
                <FiUser /> Teacher:
                <Text fontWeight={600}>{classroom.teacher.username}</Text>
              </Text>
            </Stack>
            <Divider orientation="horizontal" mt={'4'} />

            <Stack>
              <Heading fontSize={'xl'} textAlign={'left'} my={'2'}>
                Students list:
              </Heading>
              <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={5}>
                {students.map((student) => (
                  <div key={student.id}>
                    <Avatar size="lg" my={2} src={student.profilePictureURL}></Avatar>
                    <Text>{`${student.firstName} ${student.lastName}`}</Text>
                  </div>
                ))}
              </SimpleGrid>
            </Stack>
            <Divider orientation="horizontal" mt={'4'} />

            <Stack>
              <Heading fontSize={'xl'} textAlign={'left'} my={'2'}>
                Quizzes:
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mx={0}>
                {quizzes
                  .filter(
                    (quiz) =>
                      quiz.author === appState.userData?.username ||
                      students?.username === userData?.username
                  )
                  .map((quiz, index) => {
                    console.log(quiz.categories);
                    console.log(quiz);

                    return (
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
                    );
                  })}
              </SimpleGrid>
            </Stack>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}
