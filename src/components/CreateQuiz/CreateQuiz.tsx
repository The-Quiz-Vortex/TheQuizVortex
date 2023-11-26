import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, Heading, Input, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.tsx';
import { SelectType, CreateQuizValidation, createQuizFormValues, visibilityOptions, correctAnswerOption } from './createQuiz.validation.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultValuesQuiz } from './createQuiz.validation.ts'
import ControlledSelect from '../ControlledSelect/ControlledSelect.tsx';
import _ from 'lodash';
import { QuizQuestion } from '../../common/interfaces.ts';
import { modelQuizRawData } from './createQuiz.helper.ts';
import { addQuiz } from '../../services/quiz.services.ts';
import { fetchCategories } from '../../services/openTrivia.services.ts';

export interface QuizFormData {
    title: string;
    categories: string[];
    visibility: string;
    questions: QuizQuestion[];
}

export const CreateQuiz = () => {
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(AuthContext);
    const toast = useToast();
    const [categoryOptions, setCategoryOptions] = useState([]);
    
    useEffect(() => {
        (async () => {
            const result = await fetchCategories()
            setCategoryOptions(result);
        })()
    }, []);

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

    const onSubmit: SubmitHandler<createQuizFormValues> = async (values) => {
        console.log(values);
        try {
            setLoading(true);
            if (userData) {
                const formattedData = modelQuizRawData(values);
                await addQuiz(formattedData, userData?.username);
                toast({
                    title: 'Quiz created successfully',
                    description: 'You can now share your quiz with your friends',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
        } catch (error) {
            toast({
                title: 'Error creating your quiz',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } finally {
            setLoading(false);
        }
    }

    console.log(errors);
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
                                <Input type="text" placeholder="Add quiz name" {...register("title")} />
                                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                            </FormControl>
                        </Box>
                        <HStack>
                            <ControlledSelect<createQuizFormValues, SelectType, true>
                                name="visibility"
                                control={control}
                                label="Choose visibility"
                                placeholder="Select visibility"
                                options={visibilityOptions}
                                useBasicStyles
                            />

                            <Box>
                                <FormControl id="timeLimit" isInvalid={!!errors.timeLimit}>
                                    <FormLabel>Time limit</FormLabel>
                                    <Input type="number" min={0} placeholder="Add in minutes" {...register("timeLimit", { valueAsNumber: true })} />
                                    <FormErrorMessage>{errors.timeLimit?.message}</FormErrorMessage>
                                </FormControl>
                            </Box>
                        </HStack>

                        <ControlledSelect<createQuizFormValues, SelectType, true>
                            isMulti
                            name="categories"
                            control={control}
                            label="Quiz categories"
                            placeholder="Select categories"
                            options={categoryOptions}
                            useBasicStyles
                        />
                        <Accordion defaultIndex={[0]} allowMultiple>
                            {fields.map((field, index) => {
                                return (<div key={field.id}>
                                    <AccordionItem zIndex={10}>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    {`Question ${index + 1}`}
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
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

                                            <FormControl id="points" isRequired isInvalid={errors.question && !!errors.question[index]?.optionD}>
                                                <FormLabel>Question points</FormLabel>
                                                <Input type="number" placeholder="Question points" {...register(`question.${index}.points`, { valueAsNumber: true })} />
                                                <FormHelperText>Points for correct answer. You can assign more points to hard questions if you prefer.</FormHelperText>
                                                <FormErrorMessage>{errors.question && errors.question[index]?.points?.message}</FormErrorMessage>
                                            </FormControl>

                                            <ControlledSelect<createQuizFormValues, SelectType, true>
                                                name={`question.${index}.correctAnswer`}
                                                control={control}
                                                label="Select correct answer"
                                                placeholder="Select correct answer"
                                                options={correctAnswerOption}
                                                useBasicStyles
                                            />

                                            <Button marginBlockStart={10} marginBlockEnd={5} onClick={() => remove(index)}>{`Remove question ${index + 1}`}</Button>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </div>)
                            })}
                        </Accordion>
                        <Button
                            onClick={() => {
                                append({
                                    questionTitle: "",
                                    optionA: "",
                                    optionB: "",
                                    optionC: "",
                                    optionD: "",
                                    points: 1,
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
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}
