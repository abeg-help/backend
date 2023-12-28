import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils';
import { twoFactorTypeEnum } from '../../common/constants';
import { get2faCodeViaEmail } from './setup2faCodeViaEmail';
import { get2faCodeViaApp } from './setup2faCodeViaApp';

export const setupTimeBased2fa = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;
	const { twoFactorType } = req.body;

	if (!twoFactorType) {
		throw new AppError('Invalid Request', 400);
	}

	if (!user) {
		throw new AppError('Unauthorized', 401);
	}

	if (user?.timeBased2FA && user.timeBased2FA.active === true) {
		throw new AppError('2FA is already active', 400);
	}

	if (twoFactorType === twoFactorTypeEnum.EMAIL) {
		await get2faCodeViaEmail(user.email);
		return AppResponse(res, 200, null, 'OTP code sent to email successfully');
	}

	if (twoFactorType === twoFactorTypeEnum.APP) {
		const { secret, qrCode } = await get2faCodeViaApp(user);
		return AppResponse(
			res,
			200,
			{
				secret,
				qrCode,
			},
			'Created 2FA successfully'
		);
	}
});
