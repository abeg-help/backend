import { Provider } from '@/common/constants';
import { hashPassword, sendVerificationEmail, toJSON } from '@/common/utils';
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

	await sendVerificationEmail(user, req);

	// save user to cache without password
	AppResponse(res, 201, toJSON(user), 'Account created successfully');
});
