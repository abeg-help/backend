import { z } from 'zod';

export type SignUpSchemaType = typeof SignUpSchema;

const SignUpSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Please enter your username')
      .min(3, 'Username must be at least 3 characters!')
      .regex(/^\w+$/, 'Username can only contain letters, numbers and/or underscore (_)'),

    email: z.string().email('Please enter a valid email address!'),

    password: z
      .string()
      .min(12, 'Password must have at least 12 characters!')
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
        message: `Password must contain at least one uppercase letter, one lowercase letter,
		  one number and one special character or symbol`,
      }),

    confirmPassword: z.string().min(1, 'Password confirmation is required!'),
    acceptTerms: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Both passwords must match!',
    path: ['confirmPassword'],
  });

export { SignUpSchema };
