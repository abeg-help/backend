import { generateRandomString, hashData } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models/userModel';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { addEmailToQueue } from '../../queues/emailQueue';

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) {
		throw new AppError('Email is required', 400);
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new AppError('No user found with provided email', 404);
	}

	if (user.passwordResetRetries >= 3) {
		await User.findByIdAndUpdate(user._id, {
			suspended: true,
		});
		throw new AppError('Password reset retries exceeded! and account suspended', 401);
	}

	const passwordResetToken = hashData(generateRandomString());
	const passwordResetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${passwordResetToken}`;

	await User.findByIdAndUpdate(user._id, {
		passwordResetToken,
		passwordResetExpires: DateTime.now().plus({ minutes: 15 }).toJSDate(),
		passwordResetRetries: {
			$inc: 1,
		},
	});

	// add email to queue
	addEmailToQueue({
		type: 'resetPassword',
		data: {
			to: email,
			priority: 'high',
			name: user.firstName,
			token: passwordResetUrl,
		},
	});

	return AppResponse(res, 200, null, `Password reset link sent to ${email}`);
});

export const resetPasswordComplete = catchAsync(async (req: Request, res: Response) => {
	const { token, password, confirmPassword } = req.body;

	if (!token || !password || !confirmPassword) {
		throw new AppError('All fields are required', 400);
	}

	if (password !== confirmPassword) {
		throw new AppError('Passwords do not match', 400);
	}

	const user = await User.findOne({
		passwordResetToken: token,
		passwordResetExpires: {
			$gt: DateTime.now().toJSDate(),
		},
	});

	if (!user) {
		throw new AppError('Password reset token is invalid or has expired', 400);
	}

	await User.findByIdAndUpdate(user._id, {
		password,
		passwordResetToken: null,
		passwordResetExpires: null,
	});

	// send password reset complete email
	addEmailToQueue({
		type: 'passwordResetSuccessful',
		data: {
			to: user.email,
			priority: 'high',
		},
	});

	return AppResponse(res, 200, null, 'Password reset successfully');
});
