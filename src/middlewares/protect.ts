import { setCookie } from '@/common/utils';
import { authenticate } from '@/common/utils/authenticate';
import { catchAsync } from '@/middlewares';
import type { NextFunction, Request, Response } from 'express';

export const Protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

	next();
});
