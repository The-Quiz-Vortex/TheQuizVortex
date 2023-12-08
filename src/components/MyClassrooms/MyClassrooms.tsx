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
  Divider,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getAllClassrooms } from '../../services/rooms.services.ts';
import { Link } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard.tsx';

export default function ClassroomList() {
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      const classroomsData = await getAllClassrooms();
      classroomsData && setClassrooms(classroomsData);
    };

    fetchClassrooms();
  }, []);

  return (
    <>
      <Dashboard />
      <Box ml={{ base: 0, md: 60 }}>
        <Stack
          minH={'calc(100vh - 80px)'}
          bg={useColorModeValue('gray.50', 'gray.800')}
          pt="20"
          pb="20"
        >
          <Heading fontSize={'4xl'} textAlign={'center'} my={'2'}>
            My{' '}
            <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
              Classrooms
            </Text>
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'} mt={'0'} mb={'8'}>
            to enjoy all of our cool features ✌️
          </Text>
          <Flex align={'center'} justify={'center'}>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={8}
              width={'100%'}
              mx={{ base: 4, md: 8, lg: 20 }}
            >
              {classrooms.map((classroom, index) => (
                <Box
                  key={index}
                  maxW={'270px'}
                  w={'full'}
                  boxShadow={'2xl'}
                  rounded={'md'}
                  overflow={'hidden'}
                >
                  <Image
                    h={'140px'}
                    w={'full'}
                    src={'src/assets/classroom-placeholder.jpg'}
                    objectFit="cover"
                    alt="#"
                  />

                  <Box p={6}>
                    <Stack spacing={0} align={'center'} mb={5} minHeight={'70px'}>
                      <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                        {classroom.classRoomName}
                      </Heading>
                    </Stack>

                    <Stack direction={'row'} justify={'center'} spacing={6}>
                      <Stack spacing={0} align={'center'}>
                        <Text fontWeight={600}>{Object.keys(classroom.quizzes || {}).length}</Text>
                        <Text fontSize={'sm'} color={'gray.500'}>
                          Quizzes
                        </Text>
                      </Stack>
                      <Stack spacing={0} align={'center'}>
                        <Text fontWeight={600}>{Object.keys(classroom.students || {}).length}</Text>
                        <Text fontSize={'sm'} color={'gray.500'}>
                          Students
                        </Text>
                      </Stack>
                    </Stack>
                    <Divider orientation="horizontal" mt={'4'} />
                    <Text color={'gray.500'} pt="3">
                      Teacher: {classroom.teacher && classroom.teacher.username}
                    </Text>

                    <Link
                      to={`/classroom/${classroom.classRoomName
                        .toLowerCase()
                        .replaceAll(' ', '-')}`}
                    >
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
                        Enter Classroom
                      </Button>
                    </Link>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Flex>
        </Stack>
      </Box>
    </>
  );
}
