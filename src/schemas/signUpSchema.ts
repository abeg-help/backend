import { PhoneNumberUtil } from 'google-libphonenumber';
import { z } from 'zod';

const verifyPhoneNumber = (value: string) => {
	const phoneUtil = PhoneNumberUtil.getInstance();
	const number = phoneUtil.parse(value.includes('+') ? value : `+${value}`, 'NG');
	return phoneUtil.isValidNumber(number);
};

export const SignUpSchema = z
	.object({
		firstName: z
			.string()
			.min(2, 'First name must be at least 2 characters long')
			.max(50, 'First name must not be 50 characters long')
			.regex(
				/^[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g,
				'Firstname must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").'
			),
		lastName: z
			.string()
			.min(2, 'Last name must be at least 2 characters long')
			.max(50, 'Last name must not be 50 characters long')
			.regex(
				/^[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g,
				'Lastname must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").'
			),
		email: z.string().email('Please enter a valid email address!'),
		password: z
			.string()
			.min(8, 'Password must have at least 8 characters!')
			.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
				message: `Password must contain at least one uppercase letter, one lowercase letter, one number and one special character or symbol`,
			}),
		phoneNumber: z.string().refine((value) => verifyPhoneNumber(value), {
			message: 'Invalid Nigerian phone number.',
		}),
		gender: z.enum(['male', 'female', 'other', 'none'], {
			errorMap: () => ({ message: 'Please choose one of the gender options' }),
		}),
		confirmPassword: z.string().min(8, 'Password confirmation is required!'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match!',
		path: ['confirmPassword'],
	});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
