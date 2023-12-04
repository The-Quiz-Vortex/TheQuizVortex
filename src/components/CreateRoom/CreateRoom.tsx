import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Stack,
  useColorModeValue,
  Button,
  FormLabel,
} from '@chakra-ui/react';
import { getAllQuizzes } from '../../services/quiz.services';
import { useUserContext } from '../../helpers/useUserContext';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users.services';
import Select from 'react-select';
import Dashboard from '../Dashboard/Dashboard';
import { db } from '../../config/firebase-config';
import { push, ref, set, get } from 'firebase/database';

const CreateRoom = () => {
  const { appState } = useUserContext();
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [classroomName, setClassroomName] = useState('');
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    // Assuming getAllQuizzes and getAllUsers are asynchronous functions
    const fetchData = async () => {
      // Fetch classroom name

      // Fetch quizzes
      const quizzesData = await getAllQuizzes();
      setQuizzes(quizzesData);

      // Fetch students
      const studentsData = await getAllUsers();
      setStudents(studentsData);
    };

    fetchData();
  }, []); // Empty dependency array to fetch data only once

  const resetForm = () => {
    setClassroomName('');
    setSelectedQuizzes([]);
    setSelectedStudents([]);
  };

  const createClassroom = async () => {
    const selectedQuizzesIds = selectedQuizzes.map((quiz) => quiz.value);
    const selectedStudentsIds = selectedStudents.map((student) => student.value);

    const classroomsRef = ref(db, 'classRooms');
    const newClassroomRef = push(classroomsRef);

    // Create an object to hold quizzes data
    const quizzesData = {};
    for (const quizId of selectedQuizzesIds) {
      const quizKey = push(ref(db, 'quizzes')).key;
      quizzesData[quizKey] = { quizId };
    }

    // Create an object to hold students data
    const studentsData = {};
    for (const uid of selectedStudentsIds) {
      const studentKey = push(ref(db, 'students')).key;
      studentsData[studentKey] = { uid };
    }

    // Set data for the new classroom using the generated key
    await set(newClassroomRef, {
      classRoomName: classroomName,
      quizzes: quizzesData,
      students: studentsData,
      teacher: {
        uid: appState.userData?.uid,
        username: appState.userData?.username,
      },
    });

    // Reset the form or navigate to another page
    resetForm();

    // Return a resolved promise
    return Promise.resolve();
  };

  return (
    <>
      <Dashboard />

      <Box minH="calc(100vh - 140px)" ml={{ base: 0, md: 60 }}>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          flexDirection={'column'}
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Heading fontSize={'4xl'} textAlign={'center'} my={'2'}>
            Create new{' '}
            <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
              Classroom
            </Text>
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'} mt={'2'}>
            to enjoy all of our cool features ✌️
          </Text>
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={6}
          >
            <FormLabel mt={'0'} mb={'0'}>
              Classroom name:
            </FormLabel>
            <Input
              type="text"
              placeholder="My new Classroom"
              borderColor={'gray.300'}
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
            />
            <FormLabel mt={'2'} mb={'0'}>
              Select your quizzes:
            </FormLabel>
            <Select
              isMulti
              name="quizzes"
              options={quizzes
                .filter((quiz) => quiz.author === appState.userData?.username)
                .map((quiz) => ({ label: quiz.title, value: quiz.id }))}
              value={selectedQuizzes}
              onChange={(selectedOptions) => setSelectedQuizzes(selectedOptions)}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="My Quizzes"
            />
            <FormLabel mt={'2'} mb={'0'}>
              Invite students:
            </FormLabel>
            <Select
              isMulti
              name="students"
              options={students
                .filter((user) => user.role === 'student')
                .map((user) => ({ label: user.username, value: user.uid }))}
              value={selectedStudents}
              onChange={(selectedOptions) => setSelectedStudents(selectedOptions)}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Students List"
            />
            <Stack spacing={6} direction={['column', 'row']} mt={3}>
              <Button
                bg={'red.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'red.500',
                }}
                onClick={resetForm}
              >
                Reset
              </Button>
              <Button
                bg={'blue.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={createClassroom}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Box>
    </>
  );
};

export default CreateRoom;
