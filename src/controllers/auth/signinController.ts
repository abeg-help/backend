import type { Request, Response } from 'express';
import User from '../../models/userModel';
import AppError from '../../common/utils/appError';
import { Provider } from '../../common/constants';
import { JWTExpiresIn } from '../../common/constants';
import { setCookie, setCache } from 'src/common/utils';

const signInController = async (req: Request, res: Response) => {
	const body = req.body as { email: string; password: string };
	const user = await User.findOne({ email: body.email, isDeleted: false, providers: Provider.Local }).select(
		'refreshToken loginRetries isSuspended isEmailVerified lastLogin password'
	);

	if (!user) {
		throw new AppError('Enter a invalid email or password', 401);
	}

	const isValid = await user.verifyPassword(body.password);

	if (!isValid) {
		throw new AppError('Enter a invalid email or password', 401);
	}

	if (!user.isEmailVerified) {
		throw new AppError('Your email is yet to be verified');
	}

	if (user.isSuspended) {
		throw new AppError('Your account is currently suspended');
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
