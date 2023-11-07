import { generateRandomString, hashData } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models/userModel';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';

export const seedUser = catchAsync(async (req: Request, res: Response) => {
	const user = await UserModel.create({
		firstName: 'test',
		lastName: 'test',
		email: 'test@gmail.com',
		password: 'password',
	});

	return AppResponse(res, 200, user, 'User created');
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) {
		throw new AppError('Email is required', 400);
	}

	const user = await UserModel.findOne({ email });

	if (!user) {
		throw new AppError('no user found with provided email', 404);
	}

	const token = hashData(generateRandomString());

	user.passwordResetToken = token;
	user.passwordResetExpires = DateTime.now().plus({ minutes: 10 }).toJSDate();
	await user.save();

	return AppResponse(res, 200, token, 'Password reset link sent to your email');
});
