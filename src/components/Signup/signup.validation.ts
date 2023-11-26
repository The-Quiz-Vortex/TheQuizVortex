import { getUserByEmail, getUserByUsername } from "../../services/users.services.ts";
import * as z from "zod"

export const SignupValidation = z.object({
    firstName: z.string().min(1, { message: 'Min length should be 1 symbols' }).max(30, { message: 'Max length should be 30 symbols' }),
    lastName: z.string().min(1, { message: 'Min length should be 1 symbols' }).max(30, { message: 'Max length should be 30 symbols' }),
    username: z.string().min(3, { message: 'Min length should be 3 symbols' })
        .refine(async (value) => !(await getUserByUsername(value)).val(), { message: 'This username already exists' }),
    email: z.string().email().refine(async (email) => {
        return !((await getUserByEmail(email)).val())
    }, { message: 'Email already exists' },),
    phoneNumber: z.string().min(1, { message: 'Min length should be 1 symbols' }).max(15, { message: 'Max length should be 30 symbols' }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    passwordConfirmation: z
        .string()
        .min(1, { message: "You must confirm your password" }),
})
    .refine(
        ({ password, passwordConfirmation }) => password === passwordConfirmation,
        {
            message: "Passwords must match",
            path: ["passwordConfirmation"],
        }
    );

export type signUpFormValues = z.infer<typeof SignupValidation>;

export const defaultValues: signUpFormValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
};