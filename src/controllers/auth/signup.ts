import { ENVIRONMENT } from '@/common/config';
import { Provider } from '@/common/constants';
import { hashData, hashPassword, sendVerificationEmail, setCache, setCookie, toJSON } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models';
import { Request, Response } from 'express';

export const signUp = catchAsync(async (req: Request, res: Response) => {
	const { email, firstName, lastName, password, isTermAndConditionAccepted } = req.body;

	if (!email || !firstName || !lastName || !password) {
		throw new AppError('Incomplete signup data', 400);
	}

	if (!isTermAndConditionAccepted) {
		throw new AppError('Kindly accept terms and conditions to sign up', 400);
	}

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new AppError(`User with email already exists`, 409);
	}

	const hashedPassword = await hashPassword(password);

	const user = await User.create({
		email,
		firstName,
		lastName,
		password: hashedPassword,
		provider: Provider.Local,
		isTermAndConditionAccepted,
	});

	console.log('user', user);

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
	await sendVerificationEmail(user);

	// delete user from collection
	// TODO:review this
	// await User.findByIdAndDelete(user._id);

	// save user to cache without password
	await setCache(user._id.toString(), { ...toJSON(user, ['password']), refreshToken });
	AppResponse(res, 201, toJSON(user), 'Account created successfully');
});
