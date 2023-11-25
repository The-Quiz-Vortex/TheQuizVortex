import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SignInValidation, signInFormValues } from './signin.validation.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultValues } from './signin.validation.ts';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AuthContext } from '../../context/AuthContext.tsx';
import { loginUser } from '../../services/auth.services.ts';

export default function Singin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const { setUser } = useContext(AuthContext);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<signInFormValues>({
    resolver: zodResolver(SignInValidation),
    defaultValues,
  });

  const onSubmit: SubmitHandler<signInFormValues> = async (user) => {
    try {
      setLoading(true);
      const result = await loginUser(user.email, user.password);

      setUser((prevState) => ({
        ...prevState,
        user: result,
      }));

      toast({
        title: 'Successful log in',
        status: 'success',
        isClosable: true,
        position: 'top',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      toast({
        title: 'Error log in',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        description: error.message,
      });
    } finally {
      setLoading(false);
      reset(defaultValues);
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
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>

        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="text" placeholder="Email" {...register('email')} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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

            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack>
              <Button
                type="submit"
                loadingText="Verifying"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                isLoading={isSubmitting || loading}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
