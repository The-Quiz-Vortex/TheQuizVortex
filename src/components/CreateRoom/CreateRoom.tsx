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
  useToast,
} from '@chakra-ui/react';
import { getAllQuizzes } from '../../services/quiz.services';
import { useUserContext } from '../../helpers/useUserContext';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users.services';
import Select from 'react-select';
import Dashboard from '../Dashboard/Dashboard';
import { db } from '../../config/firebase-config';
import { push, ref, set } from 'firebase/database';
import { Classroom, validateClassroom } from './createRoom.validations';

const CreateRoom = () => {
  const toast = useToast();
  const { appState } = useUserContext();
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [classroomName, setClassroomName] = useState('');
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const quizzesData = await getAllQuizzes();
      setQuizzes(quizzesData);

      const studentsData = await getAllUsers();
      setStudents(studentsData);
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setClassroomName('');
    setSelectedQuizzes([]);
    setSelectedStudents([]);
  };

  const showToast = (status: string, title: string) => {
    toast({
      title,
      status: status,
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const createClassroom = async () => {
    try {
      if (
        !classroomName ||
        !selectedQuizzes.length ||
        !selectedStudents.length ||
        !appState.userData?.uid ||
        !appState.userData?.username
      ) {
        showToast('error', 'All fields are required');
        return;
      }

      const classroomData: Classroom = {
        classRoomName: classroomName,
        quizzes: {},
        students: {},
        teacher: {
          uid: appState.userData?.uid || '',
          username: appState.userData?.username || '',
        },
      };

      // Validate using Zod schema
      validateClassroom(classroomData);

      const selectedQuizzesIds = selectedQuizzes.map((quiz) => quiz.value);
      const selectedStudentsInfo = selectedStudents.map((student) => {
        const selectedStudent = students.find((s) => s.uid === student.value);
        return {
          uid: selectedStudent?.uid || '',
          username: selectedStudent?.username || '',
          firstName: selectedStudent?.firstName || '',
          lastName: selectedStudent?.lastName || '',
          profilePictureURL: selectedStudent?.profilePictureURL || '',
        };
      });

      const classroomsRef = ref(db, 'classRooms');
      const newClassroomRef = push(classroomsRef);

      const quizzesData = {};
      for (const quizId of selectedQuizzesIds) {
        const quizKey = push(ref(db, 'quizzes')).key;
        quizzesData[quizKey] = { quizId };
      }

      const studentsData = {};
      for (const uid of selectedStudentsInfo) {
        const studentKey = push(ref(db, 'students')).key;
        studentsData[studentKey] = { uid };
        studentsData[studentKey] = studentsData[studentKey].uid;
      }

      await set(newClassroomRef, {
        classRoomName: classroomName,
        quizzes: quizzesData,
        students: studentsData,
        teacher: {
          uid: appState.userData?.uid,
          username: appState.userData?.username,
        },
      });

      resetForm();

      showToast('success', 'Classroom created successfully!');
    } catch (error) {
      console.error('error', 'Error creating classroom:', error);
      showToast('erorr', 'Error creating classroom. Please try again.');
    }
  };

  return (
    <>
      <Dashboard />

      <Box ml={{ base: 0, md: 60 }}>
        <Flex
          minH={'calc(100vh - 80px)'}
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
              isRequired
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
