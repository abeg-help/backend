import { Request, Response } from 'express';
import AppError from 'src/common/utils/appError';
import { UserModel } from 'src/models';
//import { IUser } from 'src/common/interfaces';
//import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from 'src/common/config';

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
			...req.body,
		});

		await newUser.save();

		const token = jwt.sign({ _id: newUser._id }, ENVIRONMENT.JWT.ACCESS_KEY, {
			expiresIn: '1h',
		});
		res.cookie('jwtToken', token, { httpOnly: true });

		const refreshToken = jwt.sign({ _id: newUser._id }, ENVIRONMENT.JWT.REFRESH_KEY, { expiresIn: '30d' });
		res.cookie('refreshToken', refreshToken, { httpOnly: true });

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
