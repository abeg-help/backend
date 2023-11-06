import type { Request, Response } from 'express';
import User from '../../models/userModel';
import AppError from '../../common/utils/appError';
import { Provider } from '../../common/constants';
import { JWTExpiresIn } from '../../common/constants';
import { setCookie, setCache } from 'src/common/utils';

const signInController = async (req: Request, res: Response) => {
	const body = req.body as { email: string; password: string };
	if (!body.email) {
		throw new AppError('Email field is required', 401);
	}
	if (!body.password) {
		throw new AppError('Password field is required', 401);
	}
	const user = await User.findOne({ email: body.email, isDeleted: false, providers: Provider.Local }).select(
		'refreshToken loginRetries isSuspended isEmailVerified lastLogin password'
	);

	if (!user) {
		throw new AppError('Enter a valid email or password', 401);
	}

	const lastUpdated = user.updatedAt.getTime() - Date.now();

	// If the user activity was 12 hours ago or more, reset the loginRetries to zero. This time can be modified to suit our business needs
	if (user.loginRetries > 0 && lastUpdated >= 12 * 60 * 60 * 1000) {
		user.loginRetries = 0;
	}

	if (user.loginRetries >= 3) {
		throw new AppError('login retries exceeded', 401);
	}

	const isValid = await user.verifyPassword(body.password);

	if (!isValid) {
		user.loginRetries = (user.loginRetries ?? 0) + 1;
		await user.save();
		throw new AppError('Enter a valid email or password', 401);
	}

	if (!user.isEmailVerified) {
		throw new AppError('Your email is yet to be verified', 401);
	}

	if (user.isSuspended) {
		throw new AppError('Your account is currently suspended', 401);
	}

	const refreshToken = user.generateRefreshToken();
	const accessToken = user.generateAccessToken();

	setCookie(res, 'x-access-token', accessToken, {
		maxAge: JWTExpiresIn.Access / 1000,
	});

	setCookie(res, 'x-refresh-token', refreshToken, {
		maxAge: JWTExpiresIn.Refresh / 1000,
	});

	user.lastLogin = new Date();
	const id = user._id.toString() as string;
	await user.save();
	await setCache(id, user.toJSON([]));
	res.json({ user });
};

export default signInController;
