import * as z from "zod"

export type createQuizFormValues = z.infer<typeof CreateQuizValidation>;

export const defaultValuesQuiz: createQuizFormValues = {
    title: "",
    categories: [],
    visibility: [{ label: "Public", value: "public" }],
    timeLimit: 0,
    question: [
        {
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
        }
    ],
};

const selectSchema = z.object({
    label: z.string(),
    value: z.string(),
});

export type SelectType = z.infer<typeof selectSchema>;

export type Visibility = z.infer<typeof selectSchema>;


export const categoryOptions: SelectType[] = [
    { label: "Increasing Retention", value: "retention" },
    { label: "Increasing User Conversion", value: "conversion" },
    { label: "Improving Feature Adoption", value: "adoption" },
    { label: "Identifying User Behavior", value: "behavior" },
    { label: "A/B Testing", value: "ab" },
];

export const visibilityOptions: SelectType[] = [
    { label: "Private", value: "private" },
    { label: "Public", value: "public" },
];

export const correctAnswerOption = [
    {
        label: 'Option A',
        value: 'optionA',
    },
    {
        label: 'Option B',
        value: 'optionB',
    },
    {
        label: 'Option C',
        value: 'optionC',
    },
    {
        label: 'Option D',
        value: 'optionD',
    },
];

export const CreateQuizValidation = z.object({
    title: z.string()
        .min(1, { message: 'Min length should be 3 symbols' })
        .max(30, { message: 'Max length should be 30 symbols' }),
    visibility: selectSchema
        .array()
        .min(1, { message: "You need to choose visibility" }),
    timeLimit: z.number().min(0).optional(),
    categories: selectSchema
        .array()
        .min(1, { message: "Please pick at least 1 category for your quiz" }),
    question: z.array(
        z.object({
            questionTitle: z.string().min(10, { message: 'Min length should be 10 symbols' }),
            optionA: z.string().min(5, { message: 'Min length should be 5 symbols' }),
            optionB: z.string().min(5, { message: 'Min length should be 5 symbols' }),
            optionC: z.string().min(5, { message: 'Min length should be 5 symbols' }),
            optionD: z.string().min(5, { message: 'Min length should be 5 symbols' }),
            points: z.number().min(1, { message: "Question points should be at least 1" }),
            correctAnswer: selectSchema
                .array()
                .min(1, { message: "Please pick at least 1 correct answer" }),
        })
    )
        .min(1, { message: "Please add at least 1 question for your quiz" }),

    // .refine((questions) => questions.length > 0, {
    //     message: "Please add at least 1 question for your quiz",
    //   })
    //   .refine((questions) =>
    //     questions.every((question) => question.correctAnswer.length > 0),
    //     { message: "Please pick at least 1 correct answer for each question" }
    //   )
})