import { ENVIRONMENT } from '@/common/config';
import { Provider } from '@/common/constants';
import { AppError, AppResponse, hashData, sendVerificationEmail, setCache, setCookie, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import type { Request, Response } from 'express';
import { DateTime } from 'luxon';

export const signIn = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new AppError('Email and password are required fields', 401);
	}

	const user = await UserModel.findOne({ email, provider: Provider.Local }).select(
		'+refreshToken +loginRetries +isSuspended +isEmailVerified +lastLogin +password +twoFA.type +twoFA.active'
	);

	if (!user) {
		throw new AppError('Email or password is incorrect', 401);
	}

	// check if user has exceeded login retries (3 times in 12 hours)
	const currentRequestTime = DateTime.now();
	const lastLoginRetry = currentRequestTime.diff(DateTime.fromISO(user.lastLogin.toISOString()), 'hours');

	if (user.loginRetries >= 3 && Math.round(lastLoginRetry.hours) < 12) {
		throw new AppError('login retries exceeded!', 401);
		// send an email to user to reset password
	}

	const isPasswordValid = await user.verifyPassword(password);
	if (!isPasswordValid) {
		await UserModel.findByIdAndUpdate(user._id, {
			$inc: { loginRetries: 1 },
		});
		throw new AppError('Email or password is incorrect', 401);
	}

	if (!user.isEmailVerified) {
		await sendVerificationEmail(user, req);
		// do not change status code from 403 as it will break frontend logic
		// 403 helps them handle redirection to email verification page
		throw new AppError('Your email is yet to be verified', 403);
	}

	if (user.isSuspended) {
		throw new AppError('Your account is currently suspended', 401);
	}

	// generate access and refresh tokens and set cookies
	const accessToken = await hashData({ id: user._id.toString() }, { expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.ACCESS });
	setCookie(res, 'abegAccessToken', accessToken, {
		maxAge: 15 * 60 * 1000, // 15 minutes
	});

	const refreshToken = await hashData(
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
		...(user.twoFA.active && { 'twoFA.isVerified': false }),
	});

	await setCache(user._id.toString(), { ...toJSON(user, ['password']), refreshToken });

	if (user.twoFA.active) {
		return AppResponse(
			res,
			200,
			{
				twoFA: {
					type: user.twoFA.type,
					active: user.twoFA.active,
				},
			},
			'Sign in successfully, proceed to 2fa verification'
		);
	} else {
		return AppResponse(res, 200, toJSON(user), 'Sign in successful');
	}
});
