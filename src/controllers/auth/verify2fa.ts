import { Request, Response } from 'express';
import { catchAsync } from '@/middlewares';
import { AppResponse, decodeData, getFromCache, removeFromCache, validateTimeBased2fa } from '../../common/utils';
import { UserModel } from '../../models';
import AppError from '../../common/utils/appError';
import { twoFactorTypeEnum } from '../../common/constants';
import { DateTime } from 'luxon';

export const verifyTimeBased2fa = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;
	const { token } = req.body;

	const userFromDb = await UserModel.findOne({ email: user?.email }).select(
		'+timeBased2FA.secret +timeBased2FA.recoveryCode'
	);

	if (!user || !userFromDb) {
		throw new AppError('Unable to complete request, try again later', 404);
	}

	if (!userFromDb.twoFA.active) {
		throw new AppError('2FA is not active', 400);
	}

	if (new Date(userFromDb.lastLogin).getTime() < DateTime.now().plus({ minutes: 5 }).toJSDate().getTime()) {
		throw new AppError('Kindly login to complete verification', 400);
	}

	const twoFAType = userFromDb.twoFA.type;

	if (twoFAType === twoFactorTypeEnum.APP) {
		const decryptedSecret = await decodeData(user.twoFA.secret!);
		const isTokenValid = validateTimeBased2fa(decryptedSecret.token, token, 1);

		if (!isTokenValid) {
			throw new AppError('Invalid token', 400);
		}
	}

	if (twoFAType === twoFactorTypeEnum.EMAIL) {
		const emailCode = await getFromCache(`2FAEmailCode:${user._id.toString()}`);

		if (!emailCode) {
			throw new AppError('Invalid verification code', 400);
		}

		const decodedData = await decodeData(Object(emailCode).token);

		if (!decodedData.token || decodedData.token !== token) {
			throw new AppError('Invalid verification code', 400);
		}

		await removeFromCache(`2FAEmailCode:${user._id.toString()}`);
	}

	return AppResponse(res, 200, user, '2FA verified successfully');
});
