import { ENVIRONMENT } from '@/common/config';
import { Provider } from '@/common/constants';
import { hashData, setCache, setCookie, toJSON } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models/userModel';
import type { Request, Response } from 'express';
import { DateTime } from 'luxon';

export const signIn = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new AppError('Email and password are required fields', 401);
	}

	const user = await User.findOne({ email, provider: Provider.Local }).select(
		'+refreshToken +loginRetries +isSuspended +isEmailVerified +lastLogin +password'
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
		await User.findByIdAndUpdate(user._id, {
			$inc: { loginRetries: 1 },
		});
		throw new AppError('Email or password is incorrect', 401);
	}

	if (!user.isEmailVerified) {
		throw new AppError('Your email is yet to be verified', 401);
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
	await User.findByIdAndUpdate(user._id, {
		loginRetries: 0,
		lastLogin: DateTime.now(),
		refreshToken,
	});

	await setCache(user._id.toString(), { ...toJSON(user, ['password']), refreshToken });
	AppResponse(res, 201, toJSON(user), 'Sign in successful');
});
