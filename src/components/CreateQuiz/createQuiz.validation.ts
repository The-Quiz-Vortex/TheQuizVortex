import { getUserByEmail, getUserByUsername } from "../../services/users.services.ts";
import * as z from "zod"

export type createQuizFormValues = z.infer<typeof CreateQuizValidation>;

export const defaultValuesQuiz: createQuizFormValues = {
    title: "",
    categories: [],
    visibility: [{ label: "Public", value: "public" }],
    timeLimit: 0,
    question: "",
    answer: "",
};

const selectSchema = z.object({
    label: z.string(),
    value: z.string(),
});

export type Categories = z.infer<typeof selectSchema>;

export type Visibility = z.infer<typeof selectSchema>;

export const categoryOptions: Categories[] = [
    { label: "Increasing Retention", value: "retention" },
    { label: "Increasing User Conversion", value: "conversion" },
    { label: "Improving Feature Adoption", value: "adoption" },
    { label: "Identifying User Behavior", value: "behavior" },
    { label: "A/B Testing", value: "ab" },
];

export const visibilityOptions: Categories[] = [
    { label: "Private", value: "private" },
    { label: "Public", value: "public" },
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
    question: z
        .string()
        .min(10, { message: "Question must be at least 6 characters" }),
    answer: z
        .string()
        .min(1, { message: "Answer must be at least 6 characters" }),
})