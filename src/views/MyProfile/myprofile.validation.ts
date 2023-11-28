import { getUserByEmail, getUserByPhone } from '../../services/users.services.ts';
import * as z from 'zod';

export const MyProfileValidation = z.object({
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),

  email: z
    .string()
    .email()
    .refine(
      async (email) => {
        return !(await getUserByEmail(email)).val();
      },
      { message: 'Email already exists' }
    ),

  phoneNumber: z
    .string()
    .length(10)
    .refine(
      async (phoneNumber) => {
        return !(await getUserByPhone(phoneNumber)).val();
      },
      { message: 'This phone number is already used by another user' }
    ),
});

export type MyProfileFormValues = z.infer<typeof MyProfileValidation>;

export const defaultValues: MyProfileFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};
