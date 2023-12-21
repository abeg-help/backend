import { sendVerificationEmail } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/queues/middlewares';
import { UserModel as User } from '@/models/userModel';
import { Request, Response } from 'express';

export const resendVerification = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) {
		throw new AppError('Email is required', 400);
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new AppError('No user found with provided email', 404);
	}

	if (user.isEmailVerified) {
		throw new AppError('Email already verified', 400);
	}
	await sendVerificationEmail(user, req);

	return AppResponse(res, 200, null, `Verification link sent to ${email}`);
});
