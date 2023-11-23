import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupValidation } from './signup.validation.ts';
import { createUserByUsername } from '../../services/users.services.ts';
import { registerUser } from '../../services/auth.services.ts';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    },
  });

  interface Values {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }

  const onSubmit = async (values: Values) => {
    try {
      setLoading(true);
      const response = await registerUser(values.email, values.password);
      await createUserByUsername(
        values.firstName,
        values.lastName,
        response.user.uid,
        values.username,
        response.user.email ?? ''
      );
      setUser({ user: response });
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user?{' '}
                <Link href="/sign-in" color={'blue.400'}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
