import { Request, Response } from 'express';
import { catchAsync } from '@/queues/middlewares';
import {
	AppResponse,
	decodeData,
	getFromCache,
	hashData,
	setCache,
	setCookie,
	toJSON,
	validateTimeBased2fa,
} from '../../common/utils';
import { UserModel } from '../../models';
import AppError from '../../common/utils/appError';
import { VerifyTimeBased2faTypeEnum } from '../../common/constants';
import { DateTime } from 'luxon';
import { ENVIRONMENT } from '../../common/config';

export const verifyTimeBased2fa = catchAsync(async (req: Request, res: Response) => {
	const { email, token, twoFactorVerificationType } = req.body;

	const user = await UserModel.findOne({ email }).select('+timeBased2FA.secret +timeBased2FA.recoveryCode');

	if (!user) {
		throw new AppError('No user found with provided email', 404);
	}

	if (!user.timeBased2FA.active) {
		throw new AppError('2FA is not active', 400);
	}

	const decryptedSecret = await decodeData(user.timeBased2FA.secret!);

	if (twoFactorVerificationType === VerifyTimeBased2faTypeEnum.CODE) {
		const isTokenValid = validateTimeBased2fa(decryptedSecret.token, token, 1);

		if (!isTokenValid) {
			throw new AppError('Invalid token', 400);
		}
	} else if (twoFactorVerificationType === VerifyTimeBased2faTypeEnum.EMAIL_CODE) {
		const emailCode = await getFromCache(`2FAEmailCode:${user._id.toString()}`);

		if (!emailCode) {
			throw new AppError('Invalid verification code', 400);
		}

		const decodedData = await decodeData(Object(emailCode).token);

		if (!decodedData.token || decodedData.token !== token) {
			throw new AppError('Invalid verification code', 400);
		}
	} else if (twoFactorVerificationType === VerifyTimeBased2faTypeEnum.DISABLE_2FA) {
		const decodedRecoveryCode = await decodeData(user.timeBased2FA.recoveryCode!);

		const trimmedToken = await token
			.replace(/\s/g, '')
			.replace(/(\d{6})/g, '$1 ')
			.trim();

		if (!decodedRecoveryCode.token || decodedRecoveryCode.token !== trimmedToken) {
			throw new AppError('Invalid recovery code', 400);
		}
	}

	// generate access and refresh tokens and set cookies
	const accessToken = hashData({ id: user._id.toString() }, { expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.ACCESS });
	setCookie(res, 'abegAccessToken', accessToken, {
		maxAge: 15 * 60 * 1000, // 15 minutes
	});

	const refreshToken = hashData(
		{ id: user._id.toString() },
		{ expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.REFRESH },
		ENVIRONMENT.JWT.REFRESH_KEY
	);
	setCookie(res, 'abegRefreshToken', refreshToken, {
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
	});

	// update user loginRetries to 0 and lastLogin to current time
	await UserModel.findByIdAndUpdate(user._id, {
		loginRetries: 0,
		lastLogin: DateTime.now(),
		refreshToken,
		...(twoFactorVerificationType === VerifyTimeBased2faTypeEnum.DISABLE_2FA && {
			$unset: {
				timeBased2FA: 1,
			},
		}),
	});

	delete user['_doc'].timeBased2FA.secret;
	user.timeBased2FA = {
		...(twoFactorVerificationType === VerifyTimeBased2faTypeEnum.DISABLE_2FA ? { active: false } : { active: true }),
	};
	await setCache(user._id.toString(), { ...toJSON(user, ['password']), refreshToken });

	return AppResponse(res, 200, user, '2FA verified successfully');
});
