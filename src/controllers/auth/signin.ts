import { JWTExpiresIn, Provider } from '@/common/constants';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models/userModel';
import type { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { setCache, setCookie } from 'src/common/utils';

export const signIn = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body as { email: string; password: string };

	if (!email || !password) {
		throw new AppError('Email and password are required fields', 401);
	}

	const user = await User.findOne({ email, providers: Provider.Local }).select(
		'refreshToken loginRetries isSuspended isEmailVerified lastLogin password'
	);

	if (!user) {
		throw new AppError('Email is incorrect', 401);
	}

	// check if user has exceeded login retries (3 times in 12 hours)
	const currentRequestTime = DateTime.now();
	const lastLoginRetry = currentRequestTime.diff(DateTime.fromISO(user.updatedAt.toISOString()), 'hours');
	console.log(lastLoginRetry);

	if (user.loginRetries >= 3 && lastLoginRetry.hours < 12) {
		throw new AppError('login retries exceeded!', 401);
	}

	const isPasswordValid = await user.verifyPassword(password);

	if (!isPasswordValid) {
		await User.findByIdAndUpdate(user._id, {
			$inc: { loginRetries: 1 },
		});
		throw new AppError('Password is incorrect', 401);
	}

	if (!user.isEmailVerified) {
		throw new AppError('Your email is yet to be verified', 401);
	}

	if (user.isSuspended) {
		throw new AppError('Your account is currently suspended', 401);
	}

	const refreshToken = user.generateRefreshToken();
	const accessToken = user.generateAccessToken();

	setCookie(res, 'abegAccessToken', accessToken, {
		maxAge: JWTExpiresIn.Access / 1000,
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
	});

	setCookie(res, 'abegRefreshToken', refreshToken, {
		maxAge: JWTExpiresIn.Refresh / 1000,
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
	});

	await User.findByIdAndUpdate(user._id, {
		$inc: { loginRetries: 0 },
		lastLogin: DateTime.now(),
	});

	await setCache(user._id.toString(), user.toJSON(['password']));
	AppResponse(res, 201, user.toJSON(), 'You have successfully created an account');
});
