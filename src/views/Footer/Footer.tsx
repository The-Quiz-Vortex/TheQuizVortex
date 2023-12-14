import {
  Box,
  Container,
  Text,
  Stack,
  VisuallyHidden,
  Button,
  Image,
  HStack,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setContentLoaded(true);
    }, 1000);
  }, []);

  return (
    <>
      {contentLoaded && (
        <Box bg={'gray.100'} color={'gray.700'}>
          <Container
            as={Stack}
            maxW={'full'}
            py={4}
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}
          >
            <Stack direction={'row'} spacing={6}>
              <Image src="../../public/quiz-logo.png" alt="footer-logo" maxWidth={'100px'} />
            </Stack>
            <HStack spacing={8} alignItems="center" d={{ base: 'none', md: 'flex' }}>
              <Link to={'/sign-up'}>Sign up</Link>
              <Link to={'/browse-quizzes'}>Browse quizzes</Link>
              <Link to={'/scoreboard'}>Scoreboard</Link>
              <Link to={'/contact'}>Contact us</Link>
            </HStack>
          </Container>

          <Box bg={'gray.800'} color={'white'}>
            <Container
              maxW={'full'}
              as={Stack}
              py={4}
              direction={{ base: 'column', md: 'row' }}
              spacing={4}
              justify={{ base: 'center', md: 'space-between' }}
              align={{ base: 'center', md: 'center' }}
            >
              <Text>© 2023 QuizVortex. All rights reserved</Text>
              <Stack direction={'row'} spacing={4} alignItems={'center'}>
                <Text>Get in touch with us:</Text>
                <Button
                  bg={'white'}
                  color={'blackAlpha.800'}
                  rounded={'full'}
                  w={10}
                  h={10}
                  p={0}
                  cursor={'pointer'}
                  as={'a'}
                  href={'https://github.com/The-Quiz-Vortex/TheQuizVortex'}
                  target={'_blank'}
                  display={'inline-flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  transition={'background 0.3s ease'}
                  _hover={{
                    bg: 'pink.400',
                    color: 'white',
                  }}
                >
                  <VisuallyHidden>{'GitHub'}</VisuallyHidden>
                  <FaGithub />
                </Button>
              </Stack>
            </Container>
          </Box>
        </Box>
      )}
    </>
  );
}
