import { Avatar, Badge, Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { AppUser, Quiz, QuizResult } from '../../common/interfaces.ts'
import { getAllUsers } from '../../services/users.services.ts'
import moment from 'moment'
import { createSearchParams, useNavigate } from 'react-router-dom'

const ResultsTableStats = ({ results, allQuizzes }: { results: QuizResult[], allQuizzes: Quiz[] }) => {
    const [users, setUsers] = useState<Array<AppUser>>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllUsersData = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(usersData || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getAllUsersData();
    }, []);

    const handleViewAnswers = (result: QuizResult) => {
        navigate({ pathname: `/quiz/${result.quizId}`, search: `?${createSearchParams({ review: result.quizResultId })}` });
    }

    return (
        <Box ml={{ base: 0, md: 60 }}>
            <Flex
                
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}
            >
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
                            <Th>Username</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Quiz</Th>
                            <Th>Score</Th>
                            <Th>Completed date</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {results.map((result) => {
                            const userData = users.find(user => user.username === result.username);
                            const quizData = allQuizzes.find(quiz => quiz.quizId === result.quizId) as Quiz;
                            return (
                                <Tr key={result.quizResultId}>
                                    <Td>
                                        <Box display="flex" justifyContent="flex-start" alignItems="center" gap="20px">
                                            <Avatar size={'md'} src={userData?.profilePictureURL} />
                                            {result.username}
                                        </Box>
                                    </Td>
                                    <Td>{`${userData?.firstName} ${userData?.lastName}`}</Td>
                                    <Td>{userData?.email}</Td>
                                    <Td>{quizData?.title}</Td>
                                    <Td>
                                        <Badge px={2} py={1} m={1} fontWeight={'600'} colorScheme={result.scorePercent < quizData?.passingScore ? 'red' : 'green'}>
                                            {result.scorePercent >= quizData?.passingScore ? 'Passed' : 'Failed'}
                                        </Badge>
                                        {`${result.scorePercent}%`}</Td>
                                    <Td>{moment(result.completedAt).format('DD-MM-YY')}</Td>
                                    <Td>
                                        <Button
                                            colorScheme='green'
                                            size="sm"
                                            m="1"
                                            minWidth={'130px'}
                                            onClick={() => handleViewAnswers(result)}
                                        >
                                            View answers
                                        </Button>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Flex>
        </Box>
    )
}

export default ResultsTableStats