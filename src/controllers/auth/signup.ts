import { Request, Response } from 'express';
import AppError from 'src/common/utils/appError';
import { catchAsync } from 'src/middlewares';
import { UserModel } from 'src/models';

export const signUp = catchAsync(async (req: Request, res: Response) => {
	const body = req.body;
	console.log(req.body);
	const userExists = await UserModel.find({ email: body.email });
	if (userExists) throw new AppError('Duplicate', 409);

	const user = await UserModel.create(body);
	console.log(user);
	return res.status(201).json({ data: user });
});
