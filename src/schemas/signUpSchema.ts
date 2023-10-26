import { z } from 'zod';

export const SignUpSchema = z
	.object({
		firstName: z
			.string()
			.min(1, 'Please enter your firstname')
			.regex(/^\w+$/, 'Firstname can only contain letters, numbers and/or underscore (_)'),
		lastName: z
			.string()
			.min(1, 'Please enter your lastname')
			.regex(/^\w+$/, 'Lastname can only contain letters, numbers and/or underscore (_)'),

		email: z.string().email('Please enter a valid email address!'),
		password: z
			.string()
			.min(12, 'Password must have at least 12 characters!')
			.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
				message: `Password must contain at least one uppercase letter, one lowercase letter, one number and one special character or symbol`,
			}),
		phoneNumber: z
			.string()
			.min(5, 'Phone number cannot be less than 5 digits!')
			.max(20, 'Phone number cannot be more than 20 digits!')
			.regex(/(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g, {
				message: 'Please enter a valid phone number!',
			}),
		gender: z.enum(['male', 'female', 'other', 'none']),
		address: z.string(),
		confirmPassword: z.string().min(1, 'Password confirmation is required!'),
		acceptTerms: z.boolean().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Both passwords must match!',
		path: ['confirmPassword'],
	});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
