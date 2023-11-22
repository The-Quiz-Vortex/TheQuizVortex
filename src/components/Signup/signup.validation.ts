import { getUserByEmail, getUserByUsername } from "../../services/users.services.ts";
import * as z from "zod"

export const SignupValidation = z.object({
    firstName: z.string().min(1, { message: 'Min length should be 1 symbols' }).max(30, { message: 'Max length should be 30 symbols' }),
    lastName: z.string().min(1, { message: 'Min length should be 1 symbols' }).max(30, { message: 'Max length should be 30 symbols' }),
    username: z.string().min(3, { message: 'Min length should be 3 symbols' }).refine(async (value) => !(await getUserByUsername(value)), { message: 'This username already exists' }),
    email: z.string().email().refine(async (email) => {
        console.log(email);
        return !((await getUserByEmail(email)).val())}, { message: 'Email already exists'}, ),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
});