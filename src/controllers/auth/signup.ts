import { Request, Response } from 'express';
import AppError from 'src/common/utils/appError';
import { UserModel } from '@/models';
import { JWTExpiresIn, Provider } from '@/common/constants';
import { setCache, setCookie } from '@/common/utils';

export const signUp = async (req: Request, res: Response) => {
	try {
		const { email, firstName, lastName, phoneNumber, password, gender } = req.body;

		if (!email || !firstName || !lastName || !phoneNumber || !password || !gender) {
			throw new AppError('Incomplete signup data', 400);
		}

		const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
		if (existingUser) {
			throw new AppError(`${existingUser.email === email ? 'Email' : 'Phone number'} has already been used`, 409);
		}

		const newUser = new UserModel({
			providers: Provider.Local,
			...req.body,
		});

		await newUser.save();

		const accessToken = newUser.generateAccessToken();
		const refreshToken = newUser.generateRefreshToken();

		setCookie(res, 'x-access-token', accessToken, {
			maxAge: JWTExpiresIn.Access / 1000,
		});

		setCookie(res, 'x-refresh-token', refreshToken, {
			maxAge: JWTExpiresIn.Refresh / 1000,
		});

		const id = newUser._id.toString() as string;
		await setCache(id, newUser.toJSON([]));

		return res.status(201).json({ message: 'You have successfully created an account', data: newUser });
	} catch (error) {
		if (error instanceof AppError) {
			res.status(error.statusCode).json({ error: error.message, data: error.data });
		} else {
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
};
