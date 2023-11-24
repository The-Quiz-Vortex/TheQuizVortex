import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Input, InputGroup, InputRightElement, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.tsx';
import { Categories, CreateQuizValidation, Visibility, categoryOptions, createQuizFormValues, visibilityOptions } from './createQuiz.validation.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultValuesQuiz } from './createQuiz.validation.ts'
import ControlledSelect from '../ControlledSelect/ControlledSelect.tsx';

export const CreateQuiz = () => {
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(AuthContext);

    const {
        handleSubmit,
        register,
        control,
        formState: { errors, isSubmitting },
    } = useForm<createQuizFormValues>({
        resolver: zodResolver(CreateQuizValidation),
        defaultValues: defaultValuesQuiz,
    });
    const onSubmit: SubmitHandler<createQuizFormValues> = (values) => {

    }
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('pink.50', 'pink.800')}
            as="form" onSubmit={handleSubmit(onSubmit)}
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Create your quiz
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        Time to get creative or browse ready-made questions ✌️
                    </Text>
                </Stack>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                            <Box>
                                <FormControl id="title" isRequired isInvalid={!!errors.title}>
                                    <FormLabel>Title</FormLabel>
                                    <Input type="text" placeholder="Title" {...register("title")} />
                                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                                </FormControl>
                            </Box>
                        <HStack>
                        <ControlledSelect<createQuizFormValues, Visibility, true>
                            name="visibility"
                            control={control}
                            label="Choose visibility"
                            placeholder="Select some categories"
                            options={visibilityOptions}
                            useBasicStyles
                        />

                            <Box>
                                <FormControl id="timeLimit" isInvalid={!!errors.timeLimit}>
                                    <FormLabel>Time limit</FormLabel>
                                    <Input type="number" placeholder="Time limit" {...register("timeLimit", { valueAsNumber: true })} />
                                    <FormErrorMessage>{errors.timeLimit?.message}</FormErrorMessage>
                                </FormControl>
                            </Box>
                        </HStack>

                        <ControlledSelect<createQuizFormValues, Categories, true>
                            isMulti
                            name="categories"
                            control={control}
                            label="Quiz categories"
                            placeholder="Select some categories"
                            options={categoryOptions}
                            useBasicStyles
                        />

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
                                Publish quiz
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                               hsdbjhdjkhdjdhj
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}
