import { AppError, AppResponse, sendVerificationEmail } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { Request, Response } from 'express';

export const resendVerification = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) {
		throw new AppError('Email is required', 400);
	}

	const user = await UserModel.findOne({ email });

	if (!user) {
		throw new AppError('No user found with provided email', 404);
	}

	if (user.isEmailVerified) {
		throw new AppError('Email already verified', 400);
	}
	await sendVerificationEmail(user, req);

	return AppResponse(res, 200, null, `Verification link sent to ${email}`);
});
