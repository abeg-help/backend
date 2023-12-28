import { Require_id } from 'mongoose';
import { IUser } from '../../common/interfaces';
import { validateTimeBased2fa, AppResponse, getFromCache, setCache, toJSON, decodeData } from '../../common/utils';
import AppError from '../../common/utils/appError';
import { catchAsync } from '../../middlewares';
import { UserModel } from '../../models';
import { Request, Response } from 'express';
import { twoFactorTypeEnum } from '../../common/constants';

export const complete2faSetup = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;
	const { token, twoFactorType } = req.body;

	console.log({ user, twoFactorType });

	if (!token || !twoFactorType) {
		throw new AppError('Token and Type is required', 400);
	}

	if (!user) {
		throw new AppError('Unauthorized, kindly login again.');
	}

	if (user?.timeBased2FA.active) {
		throw new AppError('2FA is already active', 400);
	}

	if (twoFactorType === twoFactorTypeEnum.APP) {
		const decryptedSecret = await decodeData(user.timeBased2FA.secret as string);

		if (!decryptedSecret.token) {
			throw new AppError('Unable to complete 2FA, please try again', 400);
		}

		const isTokenValid = validateTimeBased2fa(decryptedSecret.token, token, 1);

		if (!isTokenValid) {
			throw new AppError('Invalid token', 400);
		}
	}

	if (twoFactorType === twoFactorTypeEnum.EMAIL) {
		const emailCode = await getFromCache(`2FAEmailCode:${user?._id.toString()}`);

		if (!emailCode) {
			throw new AppError('Invalid token', 400);
		}

		const decodedData = await decodeData(Object(emailCode).token);

		if (!decodedData.token || decodedData.token !== token) {
			throw new AppError('Invalid verification code', 400);
		}
	}

	await UserModel.findByIdAndUpdate(user?._id, {
		'timeBased2FA.active': true,
	});

	const userFromCache = await getFromCache<Require_id<IUser>>(user._id.toString());

	if (userFromCache) {
		// update cache
		await setCache(user._id.toString()!, toJSON({ ...userFromCache, timeBased2FA: { active: true } }, []));
	}

	return AppResponse(res, 200, null, '2FA enabled successfully');
});
