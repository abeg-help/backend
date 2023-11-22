import { DateTime } from 'luxon';
import AppError from '../../common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { addEmailToQueue } from '@/queues/emailQueue';
import { Request, Response } from 'express';
import { UserModel as User } from '@/models/userModel';

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
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
		passwordResetToken: undefined,
		passwordResetExpires: undefined,
		passwordResetRetries: 0,
		passwordChangedAt: DateTime.now().toJSDate(),
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
