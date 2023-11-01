import { Request, Response } from 'express';
import AppError from 'src/common/utils/appError';
import { UserModel } from 'src/models';

export const signUp = async (req: Request, res: Response) => {
	const { email, firstName, lastName, phoneNumber, password, gender } = req.body;
	if (!email || !firstName || !lastName || !phoneNumber || !password || !gender) {
		throw new AppError('Incomplete signup data', 400);
	}
	const userExists = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
	if (userExists) {
		throw new AppError(`${userExists.email === email ? 'Email' : 'Phone number'} has already been used`, 409);
	}

	return res.status(201).json({ data: userExists });
};
