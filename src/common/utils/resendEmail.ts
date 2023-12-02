import { UserModel as User } from '@/models';
import AppError from './appError';
import { generateRandomString, hashData } from './helper';
import { addEmailToQueue } from '@/queues/emailQueue';
import { ENVIRONMENT } from '../config';

export const resendEmail = async (email: string) => {
	const foundUser = await User?.findOne({ email });
	if (!foundUser) {
		throw new AppError('No user with email');
	}
	const tokenString = await generateRandomString();
	const emailVerificationToken = await hashData({ token: tokenString });
	addEmailToQueue({
		type: 'welcomeEmail',
		data: {
			to: foundUser?.email,
			name: foundUser?.firstName,
			verificationLink: `${ENVIRONMENT.FRONTEND_URL}/verify-email/${foundUser?._id}?token=${emailVerificationToken}`,
		},
	});
};
