import { ENVIRONMENT } from '@/common/config';
import { Provider } from '@/common/constants';
import { generateRandomString, hashData, hashPassword, setCache, setCookie, toJSON } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { AppResponse } from '@/common/utils/appResponse';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models';
import { addEmailToQueue } from '@/queues/emailQueue';
import { Request, Response } from 'express';

export const signUp = catchAsync(async (req: Request, res: Response) => {
	const { email, firstName, lastName, phoneNumber, password, gender } = req.body;

	if (!email || !firstName || !lastName || !phoneNumber || !password || !gender) {
		throw new AppError('Incomplete signup data', 400);
	}

	const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
	if (existingUser) {
		if (existingUser.email === email && existingUser.phoneNumber === phoneNumber) {
			throw new AppError('Email and phone number has already been used', 409);
		} else {
			throw new AppError(`${existingUser.email === email ? 'Email' : 'Phone number'} has already been used`, 409);
		}
	}

	const hashedPassword = await hashPassword(password);

	const user = await User.create({
		email,
		firstName,
		lastName,
		phoneNumber,
		password: hashedPassword,
		gender,
		provider: Provider.Local,
	});

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

	// add welcome email to queue for user to verify account
	const tokenString = await generateRandomString();
	const emailVerificationToken = await hashData({ token: tokenString });

	addEmailToQueue({
		type: 'welcomeEmail',
		data: {
			to: email,
			name: user.firstName,
			verificationLink: `${ENVIRONMENT.FRONTEND_URL}/verify-email/${user._id}?token=${emailVerificationToken}`,
		},
	});

	// save email token to cache
	await setCache(`verification:${user._id.toString()}`, tokenString, 3600);

	// save user to cache without password
	await setCache(user._id.toString(), { ...toJSON(user, ['password']), refreshToken });
	AppResponse(res, 201, toJSON(user), 'Account created successfully');
});
