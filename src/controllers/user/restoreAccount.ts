import { AppResponse, decodeData } from '../../common/utils';
import AppError from '../../common/utils/appError';
import { catchAsync } from '../../middlewares';
import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { addEmailToQueue } from '../../queues/emailQueue';
import { ENVIRONMENT } from '../../common/config';

export const restoreAccount = catchAsync(async (req: Request, res: Response) => {
	const { token } = req.query;

	if (!token) {
		throw new AppError('Token is required', 400);
	}

	const decodedToken = await decodeData(token.toString());

	if (!decodedToken.token || !decodedToken.id) {
		throw new AppError('Invalid token', 400);
	}

	const user = await UserModel.findOne({
		_id: decodedToken.id,
		isDeleted: true,
		accountRestoreToken: decodedToken.token,
	});

	if (!user) {
		throw new AppError('Invalid token', 400);
	}

	await UserModel.findOneAndUpdate(
		{ _id: decodedToken.id, isDeleted: true },
		{
			isDeleted: false,
			passwordResetRetries: 0,
			$unset: {
				accountRestoreToken: 1,
				passwordResetToken: 1,
				passwordResetExpires: 1,
			},
		}
	);

	await addEmailToQueue({
		type: 'restoreAccount',
		data: {
			to: user.email,
			name: user?.firstName || user?.lastName || 'User',
			loginLink: `${ENVIRONMENT.FRONTEND_URL}/login`,
		},
	});

	return AppResponse(res, 200, {}, 'Account restored successfully, please login');
});
