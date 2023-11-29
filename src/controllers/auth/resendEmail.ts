import { generateRandomString, hashData, setCache, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { addEmailToQueue } from '@/queues/emailQueue';
import { ENVIRONMENT } from '@/common/config';
import { Response } from 'express';
import { CustomRequest } from '@/common/interfaces';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';

export const resendEmail = catchAsync(async (req: CustomRequest, res: Response) => {
	const _id = req.user?._id;
	const email = req.user?.email;
	const firstName = req.user?.firstName;
	if (!req.user) {
		throw new AppError('Not authenticated', 401);
	}
	if (!_id) {
		throw new AppError('Something went wrong with the ID', 400);
	}
	if (!email || !firstName) {
		throw new AppError('First name or email not provided', 400);
	}
	const tokenString = await generateRandomString();
	const emailVerificationToken = await hashData({ token: tokenString });

	addEmailToQueue({
		type: 'welcomeEmail',
		data: {
			to: email,
			name: firstName,
			verificationLink: `${ENVIRONMENT.FRONTEND_URL}/verify-email/${_id}?token=${emailVerificationToken}`,
		},
	});

	// save email token to cache
	await setCache(`verification:${_id.toString()}`, tokenString, 3600);
	AppResponse(res, 200, toJSON(req.user), 'Verified Sucesfully');
});
