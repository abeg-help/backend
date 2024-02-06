import { Provider } from '@/common/constants';
import { AppError, AppResponse, hashPassword, sendVerificationEmail, setCache, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { Request, Response } from 'express';

export const signUp = catchAsync(async (req: Request, res: Response) => {
	const { email, firstName, lastName, password, isTermAndConditionAccepted } = req.body;

	if (!email || !firstName || !lastName || !password) {
		throw new AppError('Incomplete signup data', 400);
	}

	if (!isTermAndConditionAccepted) {
		throw new AppError('Kindly accept terms and conditions to sign up', 400);
	}

	const existingUser = await UserModel.findOne({ email });
	if (existingUser) {
		throw new AppError(`User with email already exists`, 409);
	}

	const hashedPassword = await hashPassword(password);

	const user = await UserModel.create({
		email,
		firstName,
		lastName,
		password: hashedPassword,
		provider: Provider.Local,
		isTermAndConditionAccepted,
	});

	await sendVerificationEmail(user, req);

	// save user to cache without password
	await setCache(user._id.toString(), toJSON(user, ['password']));
	AppResponse(res, 201, toJSON(user), 'Account created successfully');
});
