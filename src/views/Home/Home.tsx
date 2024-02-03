import {
  chakra,
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  IconProps,
  Icon,
  Button,
  VStack,
  useColorModeValue,
  HStack,
  Image,
  Divider,
  Grid,
} from '@chakra-ui/react';
import {
  FaChalkboardTeacher,
  FaChartLine,
  FaDollarSign,
  FaCarSide,
  FaGithub,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../helpers/useUserContext.ts';
import Signout from '../../components/Signout/signout.tsx';
import { Fragment } from 'react';
import SingleTierPricing from '../Pricing/SinglePricingCard.tsx';

const Blur = (props: IconProps) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};

export default function Home() {
  const features = [
    {
      title: 'Affordable Subscription 💰',
      detail: 'Get access to all these features for just $150 per month.',
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d={`M12.75 2.75a.75.75 0 00-1.5 0V4.5H9.276a1.75 1.75 0 00-.985.303L6.596 5.957A.25.25 0 016.455 
            6H2.353a.75.75 0 100 1.5H3.93L.563 15.18a.762.762 0 00.21.88c.08.064.161.125.309.221.186.121.452.278.792.433.68.311 
            1.662.62 2.876.62a6.919 6.919 0 002.876-.62c.34-.155.606-.312.792-.433.15-.097.23-.158.31-.223a.75.75 0 
            00.209-.878L5.569 7.5h.886c.351 0 .694-.106.984-.303l1.696-1.154A.25.25 0 019.275 6h1.975v14.5H6.763a.75.75 
            0 000 1.5h10.474a.75.75 0 000-1.5H12.75V6h1.974c.05 0 .1.015.14.043l1.697 1.154c.29.197.633.303.984.303h.886l-3.368 
            7.68a.75.75 0 00.23.896c.012.009 0 0 .002 0a3.154 3.154 0 00.31.206c.185.112.45.256.79.4a7.343 7.343 0 
            002.855.568 7.343 7.343 0 002.856-.569c.338-.143.604-.287.79-.399a3.5 3.5 0 00.31-.206.75.75 0 00.23-.896L20.07 
            7.5h1.578a.75.75 0 000-1.5h-4.102a.25.25 0 01-.14-.043l-1.697-1.154a1.75 1.75 0 00-.984-.303H12.75V2.75zM2.193 
            15.198a5.418 5.418 0 002.557.635 5.418 5.418 0 002.557-.635L4.75 9.368l-2.557 5.83zm14.51-.024c.082.04.174.083.275.126.53.223 
            1.305.45 2.272.45a5.846 5.846 0 002.547-.576L19.25 9.367l-2.547 5.807z`}
          ></path>
        </svg>
      ),
    },
    {
      title: 'Track Progress 📈',
      detail:
        'With our platform, you can easily monitor how your students perform on the quizzes and provide valuable feedback.',
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d={`M3 3a2 2 0 012-2h9.982a2 2 0 011.414.586l4.018 4.018A2 2 0 0121 7.018V21a2 2 0 01-2 2H4.75a.75.75 
            0 010-1.5H19a.5.5 0 00.5-.5V8.5h-4a2 2 0 01-2-2v-4H5a.5.5 0 00-.5.5v6.25a.75.75 0 01-1.5 0V3zm12-.5v4a.5.5 
            0 00.5.5h4a.5.5 0 00-.146-.336l-4.018-4.018A.5.5 0 0015 2.5z`}
          ></path>
          <path
            d={`M4.53 12.24a.75.75 0 01-.039 1.06l-2.639 2.45 2.64 2.45a.75.75 0 11-1.022 1.1l-3.23-3a.75.75 0 
          010-1.1l3.23-3a.75.75 0 011.06.04zm3.979 1.06a.75.75 0 111.02-1.1l3.231 3a.75.75 0 010 1.1l-3.23 3a.75.75 
          0 11-1.021-1.1l2.639-2.45-2.64-2.45z`}
          ></path>
        </svg>
      ),
    },
    {
      title: 'Try Before You Buy 🆓',
      detail: 'Not sure yet? Take a test drive with our sample quiz!',
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d={`M10.157 1.154a11.07 11.07 0 013.686 0 .75.75 0 01-.25 1.479 9.568 9.568 0 00-3.186 0 .75.75 0 
            01-.25-1.48zM6.68 3.205a.75.75 0 01-.177 1.046A9.558 9.558 0 004.25 6.503a.75.75 0 01-1.223-.87 
            11.058 11.058 0 012.606-2.605.75.75 0 011.046.177zm10.64 0a.75.75 0 011.046-.177 11.058 11.058 0 
            012.605 2.606.75.75 0 11-1.222.869 9.558 9.558 0 00-2.252-2.252.75.75 0 01-.177-1.046zM2.018 
            9.543a.75.75 0 01.615.864 9.568 9.568 0 000 3.186.75.75 0 01-1.48.25 11.07 11.07 0 010-3.686.75.75 
            0 01.865-.614zm19.964 0a.75.75 0 01.864.614 11.066 11.066 0 010 3.686.75.75 0 01-1.479-.25 9.56 9.56 
            0 000-3.186.75.75 0 01.615-.864zM3.205 17.32a.75.75 0 011.046.177 9.558 9.558 0 002.252 2.252.75.75 
            0 11-.87 1.223 11.058 11.058 0 01-2.605-2.606.75.75 0 01.177-1.046zm17.59 0a.75.75 0 01.176 1.046 
            11.057 11.057 0 01-2.605 2.605.75.75 0 11-.869-1.222 9.558 9.558 0 002.252-2.252.75.75 0 011.046-.177zM9.543 
            21.982a.75.75 0 01.864-.615 9.56 9.56 0 003.186 0 .75.75 0 01.25 1.48 11.066 11.066 0 01-3.686 0 .75.75 0 01-.614-.865z`}
          ></path>
        </svg>
      ),
    },
  ];

  const overviewList = [
    {
      id: 1,
      label: 'Create Your Account',
      subLabel: 'Our onboarding team will get you up to speed in just a few hours.',
    },
    {
      id: 2,
      label: 'Create Classrooms',
      subLabel:
        'Create a dedicated space for each of your classes. Only students who are invited can access it.',
    },
    {
      id: 3,
      label: 'Create Quizzes',
      subLabel:
        'Design your quizzes, either public or private, and share them with your students. You can update or delete them as needed.',
    },
    {
      id: 4,
      label: 'Review Your Students',
      subLabel:
        'Once your students have completed their quizzes, you can review their answers and provide feedback.',
    },
  ];

  return (
    <>
      <Box position={'relative'} zIndex={'1'}>
        <Container
          as={SimpleGrid}
          maxW={'7xl'}
          columns={{ base: 1 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
          alignItems={'center'}
          height={'calc(100vh - 80px)'}
        >
          <Stack
            spacing={{ base: 10, md: 20 }}
            zIndex={'1'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={10}
          >
            <Heading lineHeight={1.1} fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
              Welcome to{' '}
              <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                QuizVortex
              </Text>{' '}
              platform
            </Heading>
            <Text
              fontSize="lg"
              textAlign="center"
              fontWeight="300"
              w={{ base: '100%', lg: '800px' }}
              mx={'auto'}
            >
              Empower your teaching experience with our platform, providing a holistic solution for
              educators to craft compelling quizzes tailored to their students' needs. Seamlessly
              create classrooms, design quizzes with the flexibility of privacy settings, and
              effortlessly review your students' responses—all within a unified and user-friendly
              environment.
            </Text>
            <Button
              as={Link}
              h={12}
              w={'fit-content'}
              px={6}
              bg={'pink.300'}
              color="white"
              _hover={{ bg: 'blue.300' }}
              variant="solid"
              size="lg"
              rounded="md"
              mx={'auto'}
              mb={{ base: 2, sm: 0 }}
            >
              <Link to="/quiz/-NlYeBjFsgGD1ri34R0u">Get started with our sample quiz</Link>
            </Button>
          </Stack>
        </Container>

        <Box>
          <Stack
            direction={'column'}
            spacing={{ base: 5, md: 10 }}
            mx={'auto'}
            justifyContent={'center'}
            w={'100%'}
            bg={'gray.50'}
            bgBlendMode={'lighten'}
            overflow={'hidden'}
            pt={150}
            pb={150}
            position={'relative'}
            zIndex={1}
            height={'calc(100vh - 80px)'}
          >
            <Stack
              bgImage={'src/assets/background-01.jpg'}
              bgSize={'cover'}
              bgRepeat={'no-repeat'}
              bgPos={'right bottom'}
              opacity={'0.025'}
              height={'100%'}
              position={'absolute'}
              left={'0'}
              top={'0'}
              right={'0'}
            />
            <Flex justifyContent={'center'} flexDirection={{ base: 'column', md: 'row' }}>
              <Heading
                lineHeight={1.1}
                mb={10}
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
              >
                Discover what{' '}
                <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                  Sets us
                </Text>{' '}
                apart
              </Heading>
            </Flex>
            <Flex
              gap={10}
              p={5}
              justifyContent={'center'}
              flexDirection={{ base: 'column', md: 'row' }}
              textAlign={{ base: 'left', md: 'center' }}
            >
              {features.map((feature, index) => (
                <Stack
                  key={index}
                  direction={{ base: 'row', md: 'column' }}
                  spacing={5}
                  alignItems={' center'}
                >
                  <Flex
                    p={3}
                    w="max-content"
                    color="white"
                    bgGradient="linear(to-r, red.400,pink.400)"
                    rounded="lg"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {feature.icon}
                  </Flex>
                  <Stack direction="column" spacing={3}>
                    <Heading fontSize="xl" fontWeight="700">
                      {feature.title}
                    </Heading>
                    <Text fontSize="md" color="gray.500" maxW={{ base: '100%', md: '330px' }}>
                      {feature.detail}
                    </Text>
                  </Stack>
                </Stack>
              ))}
            </Flex>
          </Stack>
        </Box>

        <Blur position={'absolute'} top={-10} left={-10} style={{ filter: 'blur(70px)' }} />
      </Box>

      <Container maxW="6xl" py={10} mt={100} mb={100}>
        <Heading
          lineHeight={1.1}
          mb={12}
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
        >
          How it{' '}
          <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
            works
          </Text>
          ?
        </Heading>
        <Grid
          templateColumns={{ base: 'repeat(1,1fr)', lg: 'repeat(2, 1fr)' }}
          alignItems="center"
          gap={{ base: '16', md: '0' }}
        >
          <VStack>
            <Image
              boxSize={{ base: 'auto', md: 'lg' }}
              objectFit="contain"
              src="/src/assets/stock-photo-woman-typing-on-laptop.png"
              alt="home-img"
            />
          </VStack>
          <VStack spacing={5} alignItems="flex-start" mb={{ base: 5, md: 0 }} maxW="md">
            {overviewList.map((data) => (
              <Box key={data.id}>
                <HStack spacing={7} alignItems="flex-start" mb={2}>
                  <Flex
                    fontWeight="bold"
                    fontSize="lg"
                    boxShadow="md"
                    color="white"
                    bgGradient={'linear(to-r, red.400,pink.400)'}
                    rounded="full"
                    justifyContent="center"
                    alignItems="center"
                    w={12}
                    h={12}
                    minW={12}
                    minH={12}
                  >
                    {data.id}
                  </Flex>
                  <Box textAlign={'left'}>
                    <Heading fontSize="xl" mb={2}>
                      {data.label}
                    </Heading>
                    <Text color="gray.500" fontWeight={300}>
                      {data.subLabel}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Grid>
      </Container>
      <Divider />
      <Container maxW="6xl" my={100}>
        <Heading
          lineHeight={1.1}
          mb={12}
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
        >
          Explore our{' '}
          <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
            premium{' '}
          </Text>
          features
        </Heading>
        <SingleTierPricing />
      </Container>
    </>
  );
}
