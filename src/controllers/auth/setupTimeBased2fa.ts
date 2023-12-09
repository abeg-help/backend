import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import AppError from '@/common/utils/appError';
import {
	AppResponse,
	generateRandom6DigitKey,
	generateRandomBase32,
	generateTimeBased2fa,
	getFromCache,
	hashData,
	setCache,
	toJSON,
} from '@/common/utils';
import { UserModel } from '@/models';
import { Require_id } from 'mongoose';
import { IUser } from '../../common/interfaces';

export const setupTimeBased2fa = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;

	if (!user) {
		throw new AppError('Unauthorized', 401);
	}

	if (user?.timeBased2FA && user.timeBased2FA.active) {
		throw new AppError('2FA is already active', 400);
	}

	const secret = generateRandomBase32();
	const qrCode = await generateTimeBased2fa(secret);
	let recoveryCode: string = '';

	for (let i = 0; i < 6; i++) {
		recoveryCode += i == 5 ? `${generateRandom6DigitKey()}` : `${generateRandom6DigitKey()} `;
	}

	const hashedRecoveryCode = hashData({ token: recoveryCode }, { expiresIn: 0 });
	const hashedSecret = hashData({ token: secret }, { expiresIn: 0 });

	await UserModel.findByIdAndUpdate(user?._id, {
		timeBased2FA: {
			secret: hashedSecret,
			recoveryCode: hashedRecoveryCode,
		},
	});

	const userFromCache = await getFromCache<Require_id<IUser>>(user._id.toString());

	if (userFromCache) {
		// update cache
		await setCache(
			user._id.toString()!,
			toJSON({ ...userFromCache, timeBased2FA: { secret: hashedSecret, active: false } }, [])
		);
	}

	return AppResponse(
		res,
		200,
		{
			secret,
			qrCode,
			recoveryCode,
		},
		'Created 2FA successfully'
	);
});
