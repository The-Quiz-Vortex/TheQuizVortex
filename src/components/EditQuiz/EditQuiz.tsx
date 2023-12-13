import React, { useContext, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { AuthContext } from "../../context/AuthContext.tsx";
import {
  SelectType,
  CreateQuizValidation,
  createQuizFormValues,
  visibilityOptions,
} from "../CreateQuiz/createQuiz.validation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValuesQuiz } from "../CreateQuiz/createQuiz.validation.ts";
import ControlledSelect from "../ControlledSelect/ControlledSelect.tsx";
import _ from "lodash";
import { modelQuizRawData } from "../CreateQuiz/createQuiz.helper.ts";
import {
  getQuizById,
  updateQuiz,
} from "../../services/quiz.services.ts";
import { fetchCategories } from "../../services/openTrivia.services.ts";
import { AddOptions } from "../CreateQuiz/AddOptions.tsx";
import { getAllUsers } from "../../services/users.services.ts";
import { Link, useParams, useNavigate } from "react-router-dom";

interface EditQuizProps {
  setEditMode: React.Dispatch<React.SetStateAction<string | null>>;
}

const EditQuiz: React.FC<EditQuizProps> = ({
  setEditMode,
}) => {
  const { quizId } = useParams<{ quizId: string }>();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { userData } = useContext(AuthContext);
  const toast = useToast();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [userOptions, setUserOptions] = useState<SelectType[]>([]);
  const navigate = useNavigate()

  console.log('quizId:', quizId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!quizId){
            return;
        }
        const quizData = await getQuizById(quizId);

        if (!quizData) {
          console.error(`Quiz with id ${quizId} does not exist.`);
          return;
        }

        const defaultValues = {
          title: quizData.title,
          visibility: visibilityOptions.find(
            (option) => option.value === quizData.visibility
          ),
          timeLimit: quizData.timeLimit,
          passingScore: quizData.passingScore,
          categories: quizData.categories.map((category) =>
            categoryOptions.find((option) => option.value === category)
          ),
          users: quizData.users
            ? quizData.users.map((user) =>
                userOptions.find((option) => option.value === user)
              )
            : [],
          startDate: new Date(quizData.startDate).toISOString().split("T")[0],
          endDate: new Date(quizData.endDate).toISOString().split("T")[0],
          question: quizData.questions.map((question) => ({
            questionTitle: question.questionTitle,
            points: question.points,
            options: question.options.map((option) => ({
              optionText: option.optionText,
            })),
            correctAnswer: question.correctAnswer,
          })),
        };

        setDefaultValues(defaultValues);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchData();

    (async () => {
      const result = await fetchCategories();
      setCategoryOptions(result);

      const usersData = await getAllUsers();

      const usersList = usersData.map((user) => ({
        label: user.username,
        value: user.username,
      }));
      setUserOptions(usersList);
    })();
  }, [quizId]);

  const {
    handleSubmit,
    register,
    control,
    watch,
    resetField,
    formState: { errors, isSubmitting },
    setDefaultValues,
  } = useForm<createQuizFormValues>({
    resolver: zodResolver(CreateQuizValidation),
    defaultValues: defaultValuesQuiz,
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "question",
  });

  useEffect(() => {
    if (watch("visibility")[0]?.value === "public") {
      resetField("users");
    }
  }, [watch]);

  const onSubmit: SubmitHandler<createQuizFormValues> = async (values) => {
    try {
      setLoading(true);
      if (userData) {
        const formattedData = modelQuizRawData(values);
        await updateQuiz(quizId, formattedData, userData?.username);
        toast({
          title: "Quiz updated successfully",
          description: "Your changes have been saved",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "Error updating your quiz",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {isSubmitted && (
        <Container
          minHeight="100vh"
          minW={"100%"}
          pt={50}
          textAlign={"center"}
          bg={useColorModeValue("pink.50", "pink.800")}
        >
          <Heading fontSize={"4xl"} justify={"center"}>
            Quiz updated successfully!
          </Heading>
          <br />
          <Text fontSize={"lg"} color={"gray.600"}>
            Click below to view your Dashboard with more info.
          </Text>

          <Button as={Link} to="/dashboard" mt={10} colorScheme="teal">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </Container>
      )}
      {!isSubmitted && (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("pink.50", "pink.800")}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={8} mx={"auto"} w={"3xl"} py={12} px={6}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"} textAlign={"center"}>
                Editing Quiz
              </Heading>
              <Text fontSize={"lg"} color={"gray.600"}>
                Update your quiz with the latest information ✏️
              </Text>
            </Stack>
            <Modal
              isOpen={!isSubmitted}
              onClose={() => setEditMode(null)}
              size="lg"
            >
              <ModalOverlay />
              <ModalContent maxW="2xl">
                <ModalHeader>
                  <Heading fontSize={"4xl"} textAlign={"center"}>
                    Editing Quiz
                  </Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                  >
                    <Stack spacing={4}>
                      <Box>
                        <FormControl
                          id="title"
                          isRequired
                          isInvalid={!!errors.title}
                        >
                          <FormLabel>Title</FormLabel>
                          <Input
                            type="text"
                            placeholder="Add quiz name"
                            {...register("title")}
                          />
                          <FormErrorMessage>
                            {errors.title?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Box>
                      <HStack>
                        <ControlledSelect<
                          createQuizFormValues,
                          SelectType,
                          true
                        >
                          name="visibility"
                          control={control}
                          label="Choose visibility"
                          placeholder="Select visibility"
                          options={visibilityOptions}
                          useBasicStyles
                        />

                        <Box>
                          <FormControl
                            id="timeLimit"
                            isInvalid={!!errors.timeLimit}
                          >
                            <FormLabel>Time limit</FormLabel>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Add in minutes"
                              {...register("timeLimit", {
                                valueAsNumber: true,
                              })}
                            />
                            <FormErrorMessage>
                              {errors.timeLimit?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Box>
                      </HStack>

                      <Box>
                        <FormControl
                          id="passingScore"
                          isRequired
                          isInvalid={!!errors.passingScore}
                        >
                          <FormLabel>Passing score %</FormLabel>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Add how many % are needed to pass"
                            {...register("passingScore", {
                              valueAsNumber: true,
                            })}
                          />
                          <FormErrorMessage>
                            {errors.passingScore?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Box>
                      <ControlledSelect<createQuizFormValues, SelectType, true>
                        isMulti
                        name="categories"
                        control={control}
                        label="Quiz categories"
                        placeholder="Select categories"
                        options={categoryOptions}
                        useBasicStyles
                      />
                      {watch("visibility")[0]?.value === "private" && (
                        <ControlledSelect<
                          createQuizFormValues,
                          SelectType,
                          true
                        >
                          isMulti
                          name="users"
                          control={control}
                          label="Quiz users"
                          placeholder="Select users"
                          options={userOptions}
                          useBasicStyles
                        />
                      )}

                      <HStack>
                        <Box>
                          <FormControl
                            id="startDate"
                            isRequired
                            isInvalid={!!errors.startDate}
                          >
                            <FormLabel>Start date</FormLabel>
                            <Input
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              {...register("startDate", { valueAsDate: true })}
                            />
                            <FormErrorMessage>
                              {errors.startDate?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Box>
                        <Box>
                          <FormControl
                            id="endDate"
                            isRequired
                            isInvalid={!!errors.endDate}
                          >
                            <FormLabel>End date</FormLabel>
                            <Input
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              {...register("endDate", { valueAsDate: true })}
                            />
                            <FormErrorMessage>
                              {errors.endDate?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Box>
                      </HStack>
                      <Accordion defaultIndex={[0]} allowMultiple>
                        {fields.map((field, index) => {
                          return (
                            <div key={field.id}>
                              <AccordionItem zIndex={10}>
                                <h2>
                                  <AccordionButton>
                                    <Box as="span" flex="1" textAlign="left">
                                      {`Question ${index + 1}`}
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                  <Box>
                                    <FormControl
                                      id={`questionTitle-${index}`}
                                      isRequired
                                      isInvalid={
                                        errors.question &&
                                        !!errors.question[index]?.questionTitle
                                      }
                                    >
                                      <FormLabel>{`Question ${
                                        index + 1
                                      } title`}</FormLabel>
                                      <Input
                                        type="text"
                                        placeholder="Question title"
                                        {...register(
                                          `question.${index}.questionTitle`
                                        )}
                                      />
                                      <FormErrorMessage>
                                        {errors.question &&
                                          errors.question[index]?.questionTitle
                                            ?.message}
                                      </FormErrorMessage>
                                    </FormControl>
                                  </Box>

                                  <AddOptions
                                    index={index}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                  />

                                  <FormControl
                                    mt={5}
                                    id="points"
                                    isRequired
                                    isInvalid={
                                      errors.question &&
                                      !!errors.question[index]?.points
                                    }
                                  >
                                    <FormLabel>Question points</FormLabel>
                                    <Input
                                      type="number"
                                      placeholder="Question points"
                                      {...register(`question.${index}.points`, {
                                        valueAsNumber: true,
                                      })}
                                    />
                                    <FormHelperText>
                                      Points for the correct answer. You can
                                      assign more points to hard questions if
                                      you prefer.
                                    </FormHelperText>
                                    <FormErrorMessage>
                                      {errors.question &&
                                        errors.question[index]?.points?.message}
                                    </FormErrorMessage>
                                  </FormControl>

                                  <FormControl
                                    id="question"
                                    isInvalid={
                                      errors.question &&
                                      !!errors.question[index]?.options
                                    }
                                  >
                                    <FormErrorMessage>
                                      {errors.question &&
                                        errors.question[index]?.options?.root
                                          ?.message}
                                    </FormErrorMessage>
                                  </FormControl>

                                  <Button
                                    marginBlockStart={10}
                                    marginBlockEnd={5}
                                    onClick={() => remove(index)}
                                  >{`Remove question ${index + 1}`}</Button>
                                </AccordionPanel>
                              </AccordionItem>
                            </div>
                          );
                        })}
                      </Accordion>
                      <Button
                        onClick={() => {
                          append({
                            questionTitle: "",
                            options: [
                              {
                                optionText: "",
                              },
                              {
                                optionText: "",
                              },
                            ],
                            points: 1,
                            correctAnswer: [
                              { label: "Option 1", value: "option1" },
                            ],
                          });
                          if (
                            errors.question?.root?.message ===
                            "Please add at least 1 question for your quiz"
                          ) {
                            _.unset(errors, "question");
                          }
                        }}
                      >
                        Add new question
                      </Button>
                      <FormControl
                        id="question"
                        isInvalid={
                          !!(
                            errors.question &&
                            Object.keys(errors.question).length
                          )
                        }
                      >
                        <FormErrorMessage>
                          {errors.question?.root?.message}
                        </FormErrorMessage>
                      </FormControl>
                      <Stack spacing={10} pt={2}>
                        <Button
                          type="submit"
                          loadingText="Submitting"
                          size="lg"
                          bg={"blue.400"}
                          color={"white"}
                          _hover={{
                            bg: "blue.500",
                          }}
                          isLoading={isSubmitting || loading}
                        >
                          Update quiz
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Stack>
        </Flex>
      )}
    </>
  );
};

export default EditQuiz;
