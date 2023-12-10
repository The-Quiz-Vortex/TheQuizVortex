import React, { useContext, useEffect, useRef } from 'react';
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
    Stack
} from '@chakra-ui/react';
import Dashboard from '../Dashboard/Dashboard.tsx';
// Here we have used framer-motion package for animations
import { motion } from 'framer-motion';
// Here we have used react-icons package for the icons
import { HiOutlineMail } from 'react-icons/hi';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { AiOutlineLike, AiOutlineEye } from 'react-icons/ai';
import { AuthContext } from '../../context/AuthContext.tsx';
import { getQuizResultsLastWeek } from '../../services/quizResult.services.ts';
import { getAllQuizzes, getQuizzesByAuthor } from '../../services/quiz.services.ts';

interface StatData {
    id: number;
    label: string;
    count: number;
    icon: any;
    percentage: string;
}

const Card = ({ data }: { data: StatData }) => {
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
                        bg="green.400"
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
                        <Text as="h3" fontSize="md" noOfLines={2} color="gray.400">
                            {data.label}
                        </Text>
                        <HStack spacing={2}>
                            <Text as="h2" fontSize="lg" fontWeight="extrabold">
                                {data.count}
                            </Text>
                            <Flex>
                                {Number(data.count) > 100 ? (
                                    <Icon as={BsArrowUpShort} w={6} h={6} color="green.400" />
                                ) : (
                                    <Icon as={BsArrowDownShort} w={6} h={6} color="red.400" />
                                )}
                                <Text as="h2" fontSize="md">
                                    {data.percentage}
                                </Text>
                            </Flex>
                        </HStack>
                    </VStack>
                </HStack>
                <Flex py={3} px={5} d="none" _groupHover={{ d: 'flex' }}>
                    <Link fontSize="md">View All</Link>
                </Flex>
            </Stack>
        </motion.div>
    );
};

const DashboardsStats = () => {
    const { userData } = useContext(AuthContext);
    const statData = useRef<StatData[]>([
        {
            id: 1,
            label: 'Open quizzes',
            count: 0,
            icon: AiOutlineEye,
            percentage: ''
        },
        {
            id: 2,
            label: 'Passed quizzes last week',
            count: 0,
            icon: AiOutlineLike,
            percentage: ''
        },
        {
            id: 3,
            label: 'Failed quizzes last week',
            count: 0,
            icon: HiOutlineMail,
            percentage: ''
        }
    ]);

    useEffect(() => {
        userData && (async () => {
            const quizzesLastWeek = await getQuizResultsLastWeek();
            const allQuizzes = await getAllQuizzes();
            if (userData.role === 'admin') {
                statData.current[0].count = allQuizzes?.filter(quiz => quiz.finishDate >= Date.now()).length;
                statData.current[1].count = quizzesLastWeek?.length;
            } else if (userData.role === 'teacher') {
                const teacherQuizzes = await getQuizzesByAuthor(userData.username);
                statData.current[0].count = teacherQuizzes?.filter(quiz => quiz.finishDate >= Date.now()).length;
            } else if (userData.role === 'student') {
                statData.current[0].count = allQuizzes?.filter(quiz => quiz.finishDate >= Date.now() && (quiz.visibility === 'private' && quiz.users?.includes(userData.username))).length;
            }
        })();
    }, [userData])

    return (
        <>
            <Dashboard />
            <Container maxW="7xl" p={{ base: 5, md: 20 }}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} mt={6} mb={4}>
                    {statData.current.map((data, index) => (
                        <Card key={index} data={data} />
                    ))}
                </SimpleGrid>
            </Container>
        </>
    );
};

export default DashboardsStats;