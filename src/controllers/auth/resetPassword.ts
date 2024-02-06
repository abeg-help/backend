import { AppError, AppResponse, decodeData, hashPassword } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { addEmailToQueue } from '@/queues';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { token, password, confirmPassword } = req.body;

	if (!token || !password || !confirmPassword) {
		throw new AppError('All fields are required', 400);
	}

	if (password !== confirmPassword) {
		throw new AppError('Passwords do not match', 400);
	}

	const decodedToken = await decodeData(token);

	if (!decodedToken.token) {
		throw new AppError('Invalid token', 400);
	}

	const user = await UserModel.findOne({
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

	await UserModel.findByIdAndUpdate(
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
