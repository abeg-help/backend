import { Request, Response } from 'express';
import { catchAsync } from '@/middlewares';
import { AppResponse, decodeData, validateTimeBased2fa } from '../../common/utils';
import { UserModel } from '../../models';
import AppError from '../../common/utils/appError';
import { VerifyTimeBased2faTypeEnum } from '../../common/constants';

export const verifyTimeBased2fa = catchAsync(async (req: Request, res: Response) => {
	const { email, token, twoFactorVerificationType } = req.body;

	console.log('payloads', {
		email,
		token,
		twoFactorVerificationType,
	});

	const user = await UserModel.findOne({ email }).select('+timeBased2FA.secret');

	console.log('user', user);

	if (!user) {
		throw new AppError('No user found with provided email', 404);
	}

	if (!user.timeBased2FA.active) {
		throw new AppError('2FA is not active', 400);
	}

	const decryptedSecret = await decodeData(user.timeBased2FA.secret!);

	if (twoFactorVerificationType === VerifyTimeBased2faTypeEnum.CODE) {
		const isTokenValid = validateTimeBased2fa(decryptedSecret.token, token, 1);

		console.log('isTokenValid', isTokenValid);

		if (!isTokenValid) {
			throw new AppError('Invalid token', 400);
		}
	}

	return AppResponse(res, 200, null, '2FA verified successfully');
});
