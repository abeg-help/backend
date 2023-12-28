import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import AppError from '@/common/utils/appError';
import { AppResponse, get2faCodeViaEmailHelper } from '@/common/utils';
import { twoFactorTypeEnum } from '../../common/constants';
import { generateRandomBase32, generateTimeBased2fa, hashData, setCache } from '@/common/utils';
import { getFromCache, toJSON } from '@/common/utils';
import { Require_id } from 'mongoose';
import { UserModel } from '@/models';
import { IUser } from '@/common/interfaces';

export const setupTimeBased2fa = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;
	const { twoFactorType } = req.body;

	if (!twoFactorType) {
		throw new AppError('Invalid Request', 400);
	}

	if (!user) {
		throw new AppError('Unauthorized', 401);
	}

	if (user?.twoFA && user.twoFA.active === true) {
		throw new AppError('2FA is already active', 400);
	}

	if (twoFactorType === twoFactorTypeEnum.EMAIL) {
		await get2faCodeViaEmailHelper(user.email);
		await UserModel.findByIdAndUpdate(user?._id, {
			twoFA: {
				type: twoFactorTypeEnum.EMAIL,
			},
		});

		return AppResponse(res, 200, null, 'OTP code sent to email successfully');
	}

	if (twoFactorType === twoFactorTypeEnum.APP) {
		const secret = generateRandomBase32();
		const qrCode = await generateTimeBased2fa(secret);
		const hashedSecret = hashData({ token: secret }, { expiresIn: 0 });

		await UserModel.findByIdAndUpdate(user?._id, {
			twoFA: {
				secret: hashedSecret,
				type: twoFactorTypeEnum.APP,
			},
		});

		const userFromCache = await getFromCache<Require_id<IUser>>(user._id.toString());

		if (userFromCache) {
			await setCache(
				user._id.toString()!,
				toJSON({ ...userFromCache, twoFA: { secret: hashedSecret, active: false, type: twoFactorTypeEnum.APP } }, [])
			);
		}

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
