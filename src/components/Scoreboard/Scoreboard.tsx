import React, { useContext, useEffect, useRef, useState } from 'react';
import { getAllResults } from '../../services/quizResult.services';
import { AppUser } from '../../common/interfaces';
import { AuthContext } from '../../context/AuthContext.tsx';
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import Dashboard from '../Dashboard/Dashboard.tsx';
import _ from 'lodash';
import { getAllUsers } from '../../services/users.services.ts';
import { SelectType } from '../CreateQuiz/createQuiz.validation.ts';
import { getQuizById } from '../../services/quiz.services.ts';
import { Select } from 'chakra-react-select';
import { GiRank1, GiRank2, GiRank3 } from 'react-icons/gi';

const Scoreboard: React.FC = () => {
  const [scoreboardData, setScoreboardData] = useState<
    { username: string; averageScore: number }[]
  >([]);
  const { userData } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState<Array<AppUser>>([]);
  const [quizNames, setQuizNames] = useState<SelectType[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<SelectType>();
  const generalCategory = useRef<SelectType>({ label: 'General', value: 'general' });
  const allResultsData = useRef([]);

  const findScores = (quizId?: SelectType | undefined) => {
    const data =
      quizId && quizId?.value !== 'general'
        ? allResultsData.current.filter((result) => result.quizId === quizId.value)
        : allResultsData.current;

    const groupedResults = _.groupBy(data, 'username');
    const scoreboard = _(groupedResults)
      .map((userResults, username) => {
        const averageScore = Math.round(_.meanBy(userResults, 'scorePercent'));

        return {
          username,
          averageScore,
        };
      })
      .sortBy('averageScore')
      .reverse()
      .value();
    setScoreboardData(scoreboard);
    return scoreboard;
  };

  useEffect(() => {
    findScores(selectedQuiz);
  }, [selectedQuiz]);

  useEffect(() => {
    (async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users || []);
        const allResults = await getAllResults();
        allResultsData.current = allResults;
        findScores();

        let quizList = _.uniqBy(allResults, 'quizId');
        quizList = await Promise.all(
          quizList.map(async (result) => {
            const quiz = await getQuizById(result.quizId);

            return {
              quizId: result.quizId,
              name: quiz?.title,
            };
          }) || []
        );

        const quizListData = quizList.map((quiz) => {
          return {
            label: quiz?.name,
            value: quiz?.quizId,
          };
        });

        setQuizNames([...quizListData, generalCategory.current]);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    })();
  }, []);

  return (
    <>
      <Dashboard />
      <Box ml={{ base: 0, md: 60 }} bg={useColorModeValue('gray.50', 'gray.800')} pt={20}>
        <Flex direction={'column'} alignItems={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'} my={'2'}>
            Explore the TheQuizVortex{' '}
            <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
              Scoreboard
            </Text>
          </Heading>
          <Text
            fontSize={'lg'}
            color={'gray.500'}
            mt={'2'}
            mb={'10'}
            mx={'0 auto'}
            width={{ base: '100%', md: '800px' }}
          >
            Dive into the competition with our Scoreboard feature! Track your progress and compare
            scores with other users. Who's leading the charts? Find out and fuel your competitive
            spirit. Join the ranks and celebrate success on our interactive Scoreboard!. ✌️
          </Text>
        </Flex>
        <Flex align={'center'} justify={'center'} gap={5}>
          <Text fontWeight={'bold'}>Filter quizzes:</Text>
          <Box w={{ base: '150px', md: '400px' }} bg={'white'} textAlign={'left'}>
            <Select
              name="options"
              size="lg"
              placeholder="Select Quiz"
              options={quizNames}
              defaultValue={generalCategory.current}
              onChange={(val) => setSelectedQuiz(val)}
              useBasicStyles
            />
          </Box>
        </Flex>
        <Flex align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
          <Table
            variant="simple"
            background={'white'}
            border={'1px'}
            borderColor={'gray.100'}
            maxWidth={'90%'}
            mt={'20'}
            mb={'20'}
          >
            <Thead>
              <Tr>
                <Th>Rank</Th>
                <Th>Username</Th>
                <Th>Name</Th>
                <Th>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {scoreboardData.map((user, index) => {
                const userInfo = allUsers.find((u) => u.username === user.username);
                return (
                  <Tr key={user.username}>
                    <Td>{`${index + 1}`}</Td>
                    <Td>
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        gap="20px"
                      >
                        <Avatar size={'md'} src={userInfo?.profilePictureURL} />
                        {user.username}
                      </Box>
                    </Td>
                    <Td>{`${userInfo?.firstName} ${userInfo?.lastName}`}</Td>
                    <Td>
                      <Box display="flex" alignItems="center">
                        {user.averageScore}
                        {user.averageScore > 90 && (
                          <GiRank3
                            style={{ color: 'gold', marginLeft: '5px', fontSize: '1.5rem' }}
                          />
                        )}
                        {user.averageScore > 80 && (
                          <GiRank2
                            style={{ color: 'blue', marginLeft: '5px', fontSize: '1.5rem' }}
                          />
                        )}
                        {user.averageScore > 65 && (
                          <GiRank1
                            style={{ color: 'gray', marginLeft: '5px', fontSize: '1.5rem' }}
                          />
                        )}
                      </Box>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      </Box>
    </>
  );
};

export default Scoreboard;
