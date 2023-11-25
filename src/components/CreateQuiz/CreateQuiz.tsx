import { useContext, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Input, InputGroup, InputRightElement, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.tsx';
import { SelectType, CreateQuizValidation, Visibility, categoryOptions, createQuizFormValues, visibilityOptions, correctAnswerOption } from './createQuiz.validation.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultValuesQuiz } from './createQuiz.validation.ts'
import ControlledSelect from '../ControlledSelect/ControlledSelect.tsx';
import _ from 'lodash';
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

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: 'question',
    });

    const onSubmit: SubmitHandler<createQuizFormValues> = (values) => {
            console.log('hete');
            
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('pink.50', 'pink.800')}
            as="form" onSubmit={handleSubmit(onSubmit)}
        >
            <Stack spacing={8} mx={'auto'} w={'3xl'} py={12} px={6}>
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
                            <ControlledSelect<createQuizFormValues, SelectType, true>
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

                        <ControlledSelect<createQuizFormValues, SelectType, true>
                            isMulti
                            name="categories"
                            control={control}
                            label="Quiz categories"
                            placeholder="Select some categories"
                            options={categoryOptions}
                            useBasicStyles
                        />

                        {fields.map((field, index) => {
                            return (<div key={field.id}>
                                <Box>
                                    <FormControl id="questionTitle" isRequired isInvalid={errors.question && !!errors.question[index]?.questionTitle}>
                                        <FormLabel>{`Question ${index + 1} title`}</FormLabel>
                                        <Input type="text" placeholder="Question title" {...register(`question.${index}.questionTitle`)} />
                                        <FormErrorMessage>{errors.question && errors.question[index]?.questionTitle?.message}</FormErrorMessage>
                                    </FormControl>
                                </Box>
                                <FormControl id="optionA" isRequired isInvalid={errors.question && !!errors.question[index]?.optionA}>
                                    <FormLabel>Option A</FormLabel>
                                    <Input type="text" placeholder="Option A" {...register(`question.${index}.optionA`)} />
                                    <FormErrorMessage>{errors.question && errors.question[index]?.optionA?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl id="optionB" isRequired isInvalid={errors.question && !!errors.question[index]?.optionB}>
                                    <FormLabel>Option B</FormLabel>
                                    <Input type="text" placeholder="Option B" {...register(`question.${index}.optionB`)} />
                                    <FormErrorMessage>{errors.question && errors.question[index]?.optionB?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl id="optionC" isRequired isInvalid={errors.question && !!errors.question[index]?.optionC}>
                                    <FormLabel>Option C</FormLabel>
                                    <Input type="text" placeholder="Option C" {...register(`question.${index}.optionC`)} />
                                    <FormErrorMessage>{errors.question && errors.question[index]?.optionC?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl id="optionD" isRequired isInvalid={errors.question && !!errors.question[index]?.optionD}>
                                    <FormLabel>Option D</FormLabel>
                                    <Input type="text" placeholder="Option D" {...register(`question.${index}.optionD`)} />
                                    <FormErrorMessage>{errors.question && errors.question[index]?.optionD?.message}</FormErrorMessage>
                                </FormControl>


                                <ControlledSelect<createQuizFormValues, SelectType, true>
                                    name={`question.${index}.correctAnswer`}
                                    control={control}
                                    label="Select correct answer"
                                    placeholder="Select correct answer"
                                    options={correctAnswerOption}
                                    useBasicStyles
                                />

                                <Button onClick={() => remove(index)}>{`Remove question ${index + 1}`}</Button>
                            </div>)
                        })}
                        <Button
                            onClick={() => {
                                append({
                                    questionTitle: "",
                                    optionA: "",
                                    optionB: "",
                                    optionC: "",
                                    optionD: "",
                                    correctAnswer: [{
                                        label: 'Option A',
                                        value: 'optionA',
                                    }],
                                })
                                if (errors.question?.root?.message === "Please add at least 1 question for your quiz") {
                                    _.unset(errors, 'question');
                                }
                            }
                            }
                        >
                            Add new question
                        </Button>
                        {/* <FormControl id="question" isInvalid={!!(errors.question && Object.keys(errors.question).length)}>
                            <FormErrorMessage>{errors.question?.root?.message}</FormErrorMessage>
                        </FormControl> */}
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
