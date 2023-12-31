import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import {
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  Link,
  Icon,
  SimpleGrid,
  Container,
  Stack,
  Box,
  Heading,
  Button,
} from '@chakra-ui/react';
import Dashboard from '../Dashboard/Dashboard.tsx';
// Here we have used framer-motion package for animations
import { motion } from 'framer-motion';
// Here we have used react-icons package for the icons
import { HiBan } from 'react-icons/hi';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { AiOutlineLike, AiOutlineEye } from 'react-icons/ai';
import { AuthContext } from '../../context/AuthContext.tsx';
import { getAllResults, getQuizResultsLastWeek } from '../../services/quizResult.services.ts';
import { getAllQuizzes, getQuizzesByAuthor } from '../../services/quiz.services.ts';
import {
  filterQuizzesByResults,
  getFailedQuizResultsLastWeek,
  getOpenQuizzes,
  getPassedQuizResultsLastWeek,
  getPercentageScore,
  getTeacherFailedQuizzesLastWeek,
  getTeacherOpenQuizzes,
  getTeacherPassedQuizzesLastWeek,
} from './dashboardStats.helper.ts';
import { Quiz, QuizResult } from '../../common/interfaces.ts';
import QuizList from '../QuizList/QuizList.tsx';
import ResultsTableStats from '../ResultsTableStats/ResultsTableStats.tsx';
import { ArrowLeftIcon } from '@chakra-ui/icons';

interface StatData {
  id: number;
  label: string;
  count: number;
  icon: any;
  percentage: string;
  quizzes: Quiz[];
}

const Card = ({
  data,
  setViewAll,
}: {
  data: StatData;
  setViewAll: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <motion.div whileHover={{ translateY: -5 }}>
      <Stack
        direction="column"
        rounded="md"
        boxShadow={useColorModeValue(
          '0 4px 6px rgba(160, 174, 192, 0.6)',
          '2px 4px 6px rgba(9, 17, 28, 0.9)'
        )}
        w="100%"
        textAlign="left"
        align="start"
        spacing={0}
        role="group"
        overflow="hidden"
      >
        <HStack py={6} px={5} spacing={4} bg={useColorModeValue('gray.100', 'gray.800')} w="100%">
          <Flex
            justifyContent="center"
            alignItems="center"
            rounded="lg"
            p={2}
            bgGradient="linear(to-r, red.400,pink.400)"
            position="relative"
            w={12}
            h={12}
            overflow="hidden"
            lineHeight={0}
            boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.015)"
          >
            <Icon as={data.icon} w={6} h={6} color="white" />
          </Flex>
          <VStack spacing={0} align="start" maxW="lg" h="100%">
            <Heading as="h3" mb={1} fontSize="xl" fontWeight={'600'} noOfLines={2} color="gray.400">
              {data.label}
            </Heading>
            <HStack spacing={2}>
              <Text as="h2" fontSize="lg" fontWeight="extrabold">
                {data.count}
              </Text>
              <Flex>
                {Number(data.percentage.slice(0, -1)) > 50 ? (
                  <Icon as={BsArrowUpShort} w={6} h={6} color="green.400" />
                ) : (
                  <Icon as={BsArrowDownShort} w={6} h={6} color="red.400" />
                )}
                <Text as="h2" fontSize="md">
                  {(+data.percentage.slice(0, -1)).toFixed(2)}%
                </Text>
              </Flex>
            </HStack>
          </VStack>
        </HStack>
        <Flex py={3} px={5} d="none" _groupHover={{ d: 'flex' }}>
          <Link fontSize="md" onClick={() => setViewAll(data.label)}>
            View All
          </Link>
        </Flex>
      </Stack>
    </motion.div>
  );
};

const DashboardsStats = () => {
  const { userData } = useContext(AuthContext);
  const [viewAll, setViewAll] = useState('');
  const [statDataOpenQ, setStatDataOpenQ] = useState<StatData>({
    id: 1,
    label: 'Open quizzes',
    count: 0,
    icon: AiOutlineEye,
    percentage: '',
    quizzes: [],
  });
  const [statDataPassedQ, setStatDataPassedQ] = useState<StatData>({
    id: 2,
    label: 'Passed quizzes last week',
    count: 0,
    icon: AiOutlineLike,
    percentage: '',
    quizzes: [],
  });
  const [statDataFailedQ, setStatDataFailedQ] = useState<StatData>({
    id: 3,
    label: 'Failed quizzes last week',
    count: 0,
    icon: HiBan,
    percentage: '',
    quizzes: [],
  });
  const [userResults, setUserResults] = useState<QuizResult[]>([]);
  const [quizzesData, setQuizzesData] = useState<Quiz[]>([]);

  useEffect(() => {
    userData &&
      (async () => {
        const quizResultsLastWeek = (await getQuizResultsLastWeek()) as QuizResult[];

        const allQuizzes = (await getAllQuizzes()) as Quiz[];
        setQuizzesData(allQuizzes);
        const allResults = (await getAllResults()) as QuizResult[];

        if (userData.role === 'admin') {
          setUserResults(allResults);
          const adminOpenQuizzes = getOpenQuizzes(allQuizzes);
          const adminPassedQuizzesLastWeek = getPassedQuizResultsLastWeek(
            allQuizzes,
            quizResultsLastWeek
          );
          const adminFailedQuizzesLastWeek = getFailedQuizResultsLastWeek(
            allQuizzes,
            quizResultsLastWeek
          );

          setStatDataOpenQ((prev) => ({
            ...prev,
            quizzes: adminOpenQuizzes,
            count: adminOpenQuizzes.length || 0,
            percentage: getPercentageScore(adminOpenQuizzes, allResults),
          }));
          setStatDataPassedQ((prev) => ({
            ...prev,
            count: adminPassedQuizzesLastWeek.length || 0,
            percentage: getPercentageScore(adminPassedQuizzesLastWeek, allResults),
            quizzes: filterQuizzesByResults(allQuizzes, adminPassedQuizzesLastWeek),
          }));
          setStatDataFailedQ((prev) => ({
            ...prev,
            count: adminFailedQuizzesLastWeek.length || 0,
            percentage: getPercentageScore(adminFailedQuizzesLastWeek, allResults),
            quizzes: filterQuizzesByResults(allQuizzes, adminFailedQuizzesLastWeek),
          }));
        } else if (userData.role === 'teacher') {
          const teacherQuizzes = (await getQuizzesByAuthor(userData.username)) as Quiz[];
          setUserResults(
            allResults.filter((r) => !!teacherQuizzes.find((q) => q.quizId === r.quizId))
          );
          const teacherOpenQuizzes = getOpenQuizzes(teacherQuizzes);
          const teacherPassedQuizzesLastWeek = getPassedQuizResultsLastWeek(
            teacherQuizzes,
            quizResultsLastWeek
          );
          const teacherFailedQuizzesLastWeek = getFailedQuizResultsLastWeek(
            teacherQuizzes,
            quizResultsLastWeek
          );
          setStatDataOpenQ((prev) => ({
            ...prev,
            count: teacherOpenQuizzes.length || 0,
            percentage: getPercentageScore(teacherOpenQuizzes, quizResultsLastWeek),
            quizzes: teacherQuizzes,
          }));
          setStatDataPassedQ((prev) => ({
            ...prev,
            count: teacherPassedQuizzesLastWeek.length || 0,
            percentage: getPercentageScore(teacherPassedQuizzesLastWeek, quizResultsLastWeek),
            quizzes: filterQuizzesByResults(allQuizzes, teacherPassedQuizzesLastWeek),
          }));
          setStatDataFailedQ((prev) => ({
            ...prev,
            count: teacherFailedQuizzesLastWeek.length || 0,
            percentage: getPercentageScore(teacherFailedQuizzesLastWeek, quizResultsLastWeek),
            quizzes: filterQuizzesByResults(allQuizzes, teacherFailedQuizzesLastWeek),
          }));
        } else if (userData.role === 'student' || userData.role === 'user') {
          const studentQuizzes = allQuizzes?.filter(
            (quiz) =>
              quiz.author === userData.username ||
              quiz.visibility === 'public' ||
              (quiz.finishDate >= Date.now() &&
                quiz.visibility === 'private' &&
                quiz.users?.includes(userData.username))
          );
          const userRes = allResults.filter(
            (r) =>
              !!studentQuizzes.find((q) => q.quizId === r.quizId) &&
              r.username === userData.username
          );
          setUserResults(userRes);
          const studentOpenQuizzes = getOpenQuizzes(studentQuizzes);
          let filteredStudentQuizzes = studentQuizzes.filter((quiz) =>
            userRes.find((res) => res.quizId === quiz.quizId)
          );
          console.log(filteredStudentQuizzes);
          const studentPassedQuizzesLastWeek = getPassedQuizResultsLastWeek(
            filteredStudentQuizzes,
            quizResultsLastWeek
          ).filter((res) => res.username === userData.username);
          const studentFailedQuizzesLastWeek = getFailedQuizResultsLastWeek(
            filteredStudentQuizzes,
            quizResultsLastWeek
          ).filter((res) => res.username === userData.username);
          setStatDataOpenQ((prev) => ({
            ...prev,
            count: studentOpenQuizzes.length || 0,
            percentage: getPercentageScore(studentOpenQuizzes, quizResultsLastWeek),
            quizzes: studentOpenQuizzes,
          }));
          setStatDataPassedQ((prev) => ({
            ...prev,
            count: studentPassedQuizzesLastWeek.length || 0,
            percentage: getPercentageScore(studentPassedQuizzesLastWeek, quizResultsLastWeek),
            quizzes: filterQuizzesByResults(allQuizzes, studentPassedQuizzesLastWeek),
          }));
          setStatDataFailedQ((prev) => ({
            ...prev,
            count: studentFailedQuizzesLastWeek.length || 0,
            percentage: getPercentageScore(studentFailedQuizzesLastWeek, quizResultsLastWeek),
            quizzes: filterQuizzesByResults(allQuizzes, studentFailedQuizzesLastWeek),
          }));
        }
      })();
  }, [userData]);

  if (viewAll !== '') {
    return (
      <>
        <Dashboard />
        <Box ml={{ base: 0, md: 40 }} bg={useColorModeValue('gray.50', 'gray.800')}>
          {viewAll !== '' && (
            <Link href="/dashboard">
              <Button size={'lg'} mt={10} colorScheme="teal" leftIcon={<ArrowLeftIcon />}>
                Back to Dashboard
              </Button>
            </Link>
          )}
          <Flex minH={'calc(100vh - 80px)'} align={'center'} justify={'center'} pt="10" pb="20">
            <QuizList
              quizzes={
                viewAll === 'Open quizzes'
                  ? statDataOpenQ.quizzes
                  : viewAll === 'Passed quizzes last week'
                  ? statDataPassedQ.quizzes
                  : statDataFailedQ.quizzes
              }
            />
          </Flex>
        </Box>
      </>
    );
  }

  return (
    <>
      <Dashboard />
      <Box ml={{ base: 0, md: 60 }} bg={'gray.50'}>
        <Container maxW="7xl" p={{ base: 5, md: 20 }}>
          <Flex direction={'column'} alignItems={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'} my={'2'}>
              Review your{' '}
              <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                Quizzes insights
              </Text>
            </Heading>
            <Text
              fontSize={'lg'}
              color={'gray.500'}
              mt={'2'}
              mb={'10'}
              mx={'0 auto'}
              width={{ base: '100%', md: '1070px' }}
            >
              Unlock insights into your quiz performance and beyond. Dive into a world of data with
              detailed statistics on open quizzes, passed quizzes, and failed quizzes. Start
              exploring now for a deeper understanding of your quiz journey! ✌️
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} mt={6} mb={4}>
            {[{ ...statDataOpenQ }, { ...statDataPassedQ }, { ...statDataFailedQ }].map(
              (data, index) => (
                <Card key={index} data={data} setViewAll={setViewAll} />
              )
            )}
          </SimpleGrid>
        </Container>
      </Box>
      <ResultsTableStats results={userResults} allQuizzes={quizzesData} />
    </>
  );
};

export default DashboardsStats;
