import { PhoneNumberUtil } from 'google-libphonenumber';
import { z } from 'zod';

const verifyPhoneNumber = (value: string) => {
	const phoneUtil = PhoneNumberUtil.getInstance();
	if (!value.includes('234') || value.includes('+')) return false;
	const number = phoneUtil.parse(`+${value}`, 'NG');
	return phoneUtil.isValidNumber(number);
};

export const baseSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	password: z.string(),
	phoneNumber: z.string(),
	gender: z.enum(['male', 'female', 'other', 'none']),
	confirmPassword: z.string(),
	token: z.string(),
});

export const mainSchema = z
	.object({
		firstName: z
			.string()
			.min(2, 'First name must be at least 2 characters long')
			.max(50, 'First name must not be 50 characters long')
			.refine((name) => /^(?!.*-[a-z])[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g.test(name), {
				message:
					'Firstname must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").',
			}),
		lastName: z
			.string()
			.min(2, 'Last name must be at least 2 characters long')
			.max(50, 'Last name must not be 50 characters long')
			.refine((name) => /^(?!.*-[a-z])[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g.test(name), {
				message:
					'Lastname must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").',
			}),
		email: z.string().email('Please enter a valid email address!'),
		password: z
			.string()
			.min(8, 'Password must have at least 8 characters!')
			.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
				message: `Password must contain at least one uppercase letter, one lowercase letter, one number and one special character or symbol`,
			}),
		phoneNumber: z
			.string()
			.min(10, 'Last name must be at least 10 characters long')
			.refine((value) => verifyPhoneNumber(value), {
				message: 'Invalid nigerian phone number. e.g valid format: 234xxxxxxxxxx',
			}),
		gender: z.enum(['male', 'female', 'other', 'none'], {
			errorMap: () => ({ message: 'Please choose one of the gender options' }),
		}),
		confirmPassword: z.string().min(8, 'Password confirmation is required!'),
		token: z.string(),
		userId: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match!',
		path: ['confirmPassword'],
	});
