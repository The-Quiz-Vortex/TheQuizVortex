import * as z from "zod"
import { getQuizzesByTitle } from "../../services/quiz.services.ts";

export type createQuizFormValues = z.infer<typeof CreateQuizValidation>;

export const defaultValuesQuiz: createQuizFormValues = {
    title: "",
    categories: [],
    users: [],
    visibility: [{ label: "Public", value: "public" }],
    timeLimit: 0,
    startDate: '',
    endDate: '',
    passingScore: '',
    question: [
        {
            questionTitle: "",
            options: [{
                optionText: "",
            },
            {
                optionText: "",
            }],
            points: 1,
            correctAnswer: [{ label: 'Option 1', value: 'option1' }],
        }
    ],
};

const selectSchema = z.object({
    label: z.string(),
    value: z.string(),
});

const categoriesSelectSchema = z.object({
    label: z.string(),
    value: z.number(),
});

export type SelectType = z.infer<typeof selectSchema>;

export const visibilityOptions: SelectType[] = [
    { label: "Private", value: "private" },
    { label: "Public", value: "public" },
];

export const correctAnswerOption = (numOptions: number) => Array.from({ length: numOptions }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `option${i + 1}`,
}));

export const CreateQuizValidation = z.object({
    title: z.string()
        .min(3, { message: 'Min length should be 3 symbols' })
        .max(30, { message: 'Max length should be 30 symbols' })
        .refine(async (title) => {
            const resultArr = await getQuizzesByTitle(title);
            return resultArr?.length === 0
        }, { message: 'Quiz with this title already exists' }),
    visibility: selectSchema
        .array()
        .min(1, { message: "You need to choose visibility" }),
    timeLimit: z.number().min(0).optional(),
    passingScore: z.number().min(1, { message: "Score cannot be zero" }).max(100, { message: "Score cannot be higher than 100" }),
    categories: categoriesSelectSchema
        .array()
        .min(1, { message: "Please pick at least 1 category for your quiz" }),
    users: selectSchema
        .array().optional(),
    startDate: z.date().refine(date => date >= new Date(new Date().setHours(0,0,0,0)), { message: "Date cannot be in the past" }),
    endDate: z.date().refine(date => date >= new Date(), { message: "Date must be in the future" }),
    question: z.array(
        z.object({
            questionTitle: z.string().min(10, { message: 'Min length should be 10 symbols' }),
            options: z.array(
                z.object({
                    optionText: z.string().min(5, { message: 'Min length should be 5 symbols' }),
                })
            ).min(2, { message: 'Please add at least 2 options for your question' }),
            points: z.number().min(1, { message: "Question points should be at least 1" }),
            correctAnswer: selectSchema
                .array()
                .min(1, { message: "Please pick at least 1 correct answer" }),
        })
    )
        .min(1, { message: "Please add at least 1 question for your quiz" })
})