import { decryptData, hashPassword } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models/userModel';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { addEmailToQueue } from '../../queues/emailQueue';

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { token, password, confirmPassword } = req.body;

	if (!token || !password || !confirmPassword) {
		throw new AppError('All fields are required', 400);
	}

	if (password !== confirmPassword) {
		throw new AppError('Passwords do not match', 400);
	}

	const decodedToken = await decryptData(token);

	if (!decodedToken.token) {
		throw new AppError('Invalid token', 400);
	}

	const user = await User.findOne({
		passwordResetToken: decodedToken.token,
		passwordResetExpires: {
			$gt: DateTime.now().toJSDate(),
		},
		isSuspended: false,
	});

	if (!user) {
		throw new AppError('Password reset token is invalid or has expired', 400);
	}

	const hashedPassword = await hashPassword(password);

	await User.findByIdAndUpdate(
		user._id,
		{
			password: hashedPassword,
			passwordResetRetries: 0,
			passwordChangedAt: DateTime.now().toJSDate(),
			$unset: {
				passwordResetToken: 1,
				passwordResetExpires: 1,
			},
		},
		{
			runValidators: true,
		}
	);

	// send password reset complete email
	addEmailToQueue({
		type: 'resetPassword',
		data: {
			to: user.email,
			priority: 'high',
		},
	});

	return AppResponse(res, 200, null, 'Password reset successfully');
});
