import type { IUser } from '@/common/interfaces';
import { AppError, AppResponse, setCache, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { Request, Response } from 'express';

export const editUserProfile = catchAsync(async (req: Request, res: Response) => {
	//collect the details to be updated
	const { firstName, lastName, phoneNumber, gender } = req.body;

	//get the user id to update from req.user
	const UserToUpdateID = req.user?._id;
	if (!UserToUpdateID) throw new AppError('Unauthorized, kindly login again.');

	//Partial makes the objects to update optional while extending the user interface
	const objectToUpdate: Partial<IUser> = {
		firstName,
		lastName,
		phoneNumber,
		gender,
	};

	//updates the id with object, new returns the updated user while running mongoose validation
	const updatedUser = await UserModel.findByIdAndUpdate({ _id: UserToUpdateID }, objectToUpdate, {
		new: true,
		runValidators: true,
	});

	if (!updatedUser) {
		//  no user is found to update
		return AppResponse(res, 404, null, 'User not found for update');
	}

	// update the cached user
	await setCache(updatedUser?._id?.toString(), { ...toJSON(updatedUser, ['password']), ...req.user });

	AppResponse(res, 200, toJSON(updatedUser), 'Profile Successfully Updated');
});
