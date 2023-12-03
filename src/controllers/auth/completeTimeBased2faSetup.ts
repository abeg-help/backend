import { validateTimeBased2fa, AppResponse } from '../../common/utils';
import AppError from '../../common/utils/appError';
import { catchAsync } from '../../middlewares';
import { UserModel } from '../../models';
import { Request, Response } from 'express';

export const completeTimeBased2fa = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;
	const { token } = req.body;

	if (!token) {
		throw new AppError('Token is required', 400);
	}

	if (!user?.timeBased2FA.secret) {
		throw new AppError('2FA is not active', 400);
	}

	const isTokenValid = validateTimeBased2fa(user.timeBased2FA.secret, token, 1);

	if (!isTokenValid) {
		throw new AppError('Invalid token', 400);
	}

	await UserModel.findByIdAndUpdate(user?._id, {
		'timeBased2FA.active': true,
		$unset: {
			'timeBased2FA.secret': 1,
		},
	});

	return AppResponse(res, 200, null, '2FA enabled successfully');
});
