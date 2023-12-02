import { ENVIRONMENT } from '@/common/config';
import { IUser } from '@/common/interfaces';
import { decodeData, getFromCache, hashData, setCache, setCookie } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import type { Require_id } from 'mongoose';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	// get the cookies from the request headers
	const { abegAccessToken, abegRefreshToken } = req.cookies as {
		abegAccessToken: string;
		abegRefreshToken: string;
	};

	if (!abegRefreshToken) {
		throw new AppError('Unauthorized', 401);
	}

	// verify user access

	const handleUserVerification = async (decoded) => {
		// fetch user from redis cache or db
		const cachedUser = await getFromCache<Require_id<IUser>>(decoded.id);

		const user = cachedUser
			? cachedUser
			: ((await User.findOne({ _id: decoded.id }).select(
					'refreshToken loginRetries isSuspended lastLogin'
			  )) as Require_id<IUser>);

		if (!cachedUser && user) {
			await setCache(decoded.id, user);
		}

		// check if refresh token matches the stored refresh token in db
		// in case the user has logged out and the token is still valid
		// or the user has re authenticated and the token is still valid etc

		if (user.refreshToken !== abegRefreshToken) {
			throw new AppError('Invalid token. Please log in again!', 401);
		}

		if (user.isSuspended) {
			throw new AppError('Your account is currently suspended', 401);
		}

		if (!user.isEmailVerified) {
			throw new AppError('Your email is yet to be verified', 422);
		}
		// check if user has changed password after the token was issued
		// if so, invalidate the token
		if (
			user.passwordChangedAt &&
			DateTime.fromISO(user.passwordChangedAt.toISOString()).toMillis() > DateTime.fromMillis(decoded.iat).toMillis()
		) {
			throw new AppError('Password changed since last login. Please log in again!', 401);
		}

		// csrf protection
		// browser client fingerprinting

		return user;
	};

	const handleTokenRefresh = async () => {
		try {
			const decodeRefreshToken = await decodeData(abegRefreshToken, ENVIRONMENT.JWT.REFRESH_KEY!);
			const currentUser = await handleUserVerification(decodeRefreshToken);

			// generate access and refresh tokens and set cookies
			const accessToken = await hashData(
				{ id: currentUser._id.toString() },
				{ expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.ACCESS }
			);
			setCookie(res, 'abegAccessToken', accessToken, {
				maxAge: 15 * 60 * 1000, // 15 minutes
			});

			req.user = currentUser;
		} catch (error) {
			throw new AppError('Session expired, please log in again', 401);
		}
	};

	try {
		if (!abegAccessToken) {
			// if access token is not present, verify the refresh token and generate a new access token
			await handleTokenRefresh();
		} else {
			const decodeAccessToken = await decodeData(abegAccessToken, ENVIRONMENT.JWT.ACCESS_KEY!);
			const currentUser = await handleUserVerification(decodeAccessToken);

			// attach the user to the request object
			req.user = currentUser;
		}
	} catch (error) {
		if ((error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) && abegAccessToken) {
			// verify the refresh token and generate a new access token
			await handleTokenRefresh();
		} else {
			throw new AppError('An error occurred, please log in again', 401);
		}
	}
	next();
});
