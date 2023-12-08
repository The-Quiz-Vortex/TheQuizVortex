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
} from '@chakra-ui/react';
import Dashboard from '../Dashboard/Dashboard';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleClassroom } from '../../services/rooms.services';
import { Classroom, Student } from '../../common/interfaces'; // assuming you have a Student interface
import { FiUser } from 'react-icons/fi';

export default function SingleClassroom() {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

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
  }, [classRoomName]);

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
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Stack
            spacing={4}
            w={'full'}
            maxW={'90%'}
            bg={useColorModeValue('white', 'gray.700')}
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
              <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={5}></SimpleGrid>
            </Stack>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}
