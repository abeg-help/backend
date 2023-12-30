import { setCookie } from '@/common/utils';
import { authenticate } from '@/common/utils/authenticate';
import { catchAsync } from '@/middlewares';
import type { NextFunction, Request, Response } from 'express';
import AppError from '../../common/utils/appError';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	// get the cookies from the request headers
	const { abegAccessToken, abegRefreshToken } = req.cookies;

	const { currentUser, accessToken } = await authenticate({ abegAccessToken, abegRefreshToken });

	if (accessToken) {
		setCookie(res, 'abegAccessToken', accessToken, {
			maxAge: 15 * 60 * 1000, // 15 minutes
		});
	}

	// attach the user to the request object
	req.user = currentUser;

	const reqPath = req.path;

	if (reqPath !== '/2fa/verify') {
		const lastLoginTimeInMilliseconds = new Date(currentUser.lastLogin).getTime();
		const lastVerificationTimeInMilliseconds = new Date(currentUser.twoFA.verificationTime as Date).getTime();

		if (lastLoginTimeInMilliseconds > lastVerificationTimeInMilliseconds) {
			throw new AppError('Kindly login to process request', 401);
		}
	}

	next();
});
