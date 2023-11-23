import { ENVIRONMENT } from '@/common/config';
import { JWTExpiresIn } from '@/common/constants';
import type { CustomRequest } from '@/common/interfaces';
import { IUser } from '@/common/interfaces';
import { getFromCache, setCache, setCookie } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { promisify } from 'util';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	// get the cookies from the request headers
	const { abegAccessToken, abegRefreshToken } = req.cookies as {
		abegAccessToken: string;
		abegRefreshToken: string;
	};

	if (!abegAccessToken || !abegRefreshToken) {
		throw new AppError('Unauthorized', 401);
	}

	// verify user access

	const handleUserVerification = async (decoded) => {
		// fetch user from redis cache or db
		const cachedUser = (await getFromCache(decoded.id)) as IUser;
		const user = cachedUser
			? cachedUser
			: ((await User.findOne({ _id: decoded.id })
					.select('refreshToken loginRetries isSuspended isEmailVerified lastLogin')
					.lean()) as IUser);

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
			DateTime.fromISO(user.passwordChangedAt.toISOString()).toMillis() > DateTime.fromMillis(decoded.iat).toMillis()
		) {
			throw new AppError('Password changed since last login. Please log in again!', 401);
		}

		// csrf protection
		// browser client fingerprinting

		return user;
	};

	try {
		const verifyAsync: (arg1: string, arg2: string) => jwt.JwtPayload = promisify(jwt.verify);
		const decodeAccessToken = verifyAsync(abegAccessToken, ENVIRONMENT.JWT.ACCESS_KEY!);
		const currentUser: IUser = await handleUserVerification(decodeAccessToken);

		// attach the user to the request object
		(req as CustomRequest).user = currentUser;
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
			// verify the refresh token and generate a new access token
			try {
				const verifyAsync: (arg1: string, arg2: string) => jwt.JwtPayload = promisify(jwt.verify);
				const decodeRefreshToken = await verifyAsync(abegRefreshToken, ENVIRONMENT.JWT.REFRESH_KEY!);

				const currentUser: IUser = await handleUserVerification(decodeRefreshToken);

				const accessToken = jwt.sign({ id: currentUser._id }, ENVIRONMENT.JWT.ACCESS_KEY, {
					expiresIn: JWTExpiresIn.Access,
				});

				setCookie(res, 'abegAccessToken', accessToken, {
					maxAge: JWTExpiresIn.Access / 1000,
				});

				(req as CustomRequest).user = currentUser;
			} catch (error) {
				next(new AppError('Invalid token, please log in again', 401));
			}
		} else {
			next(new AppError('Invalid token, please log in again', 401));
		}
	}
	next();
});
