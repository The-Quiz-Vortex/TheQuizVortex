import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupValidation, signUpFormValues } from './signup.validation.ts';
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
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { defaultValues } from './signup.validation.ts';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<signUpFormValues>({
    resolver: zodResolver(SignupValidation),
    defaultValues,
  });

  const onSubmit: SubmitHandler<signUpFormValues> = async (values) => {
    try {
      setLoading(true);
      const response = await registerUser(values.email, values.password);
      await createUserByUsername(
        values.firstName,
        values.lastName,
        response.user.uid,
        values.email,
        values.phoneNumber,
        values.username
      );
      setUser({ user: response });
      toast({
        title: 'Success',
        description: 'You have been registered successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
        description: error.message,
      });
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
      as="form"
      onSubmit={handleSubmit(onSubmit)}
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
                <FormControl id="firstName" isRequired isInvalid={!!errors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" placeholder="First name" {...register('firstName')} />
                  <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
                </FormControl>
              </Box>

              <Box>
                <FormControl id="lastName" isRequired isInvalid={!!errors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" placeholder="Last name" {...register('lastName')} />
                  <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>

            <HStack>
              <Box>
                <FormControl id="email" isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input type="text" placeholder="Email" {...register('email')} />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
              </Box>

              <Box>
                <FormControl id="phoneNumber" isRequired isInvalid={!!errors.phoneNumber}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input type="text" placeholder="Phone number" {...register('phoneNumber')} />
                  <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>

            <FormControl id="username" isRequired isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input type="text" placeholder="Username" {...register('username')} />
              <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password')}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl
              id="passwordConfirmation"
              isRequired
              isInvalid={!!errors.passwordConfirmation}
            >
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  {...register('passwordConfirmation')}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.passwordConfirmation?.message}</FormErrorMessage>
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                isLoading={isSubmitting || loading}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user?{' '}
                <Link to="/sign-in" color={'blue.400'}>
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
