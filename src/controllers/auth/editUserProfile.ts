import { Response } from 'express';
import { setCache } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { UserModel as User } from '@/models';
import { CustomRequest, IUser } from '@/common/interfaces';
import { AppResponse } from '@/common/utils/appResponse';

export const editUserProfile = catchAsync(async (req: CustomRequest, res: Response) => {
	//collect the details to be updated
	const { firstName, lastName, phoneNumber, gender } = req.body;

	//get the user id to update from req.user
	const UserToUpdateEmail = req.user?._id;

	//Partial makes the objects to update optional while extending the user inteface
	const objectToUpdate: Partial<IUser> = {
		firstName,
		lastName,
		phoneNumber,
		gender,
	};

	//updates the id with object, new returns the updated user while runnung mongoose validation
	const updatedUser = await User.findByIdAndUpdate({ _id: UserToUpdateEmail }, objectToUpdate, {
		new: true,
		runValidators: true,
	});

	await setCache(`Updated User: ${updatedUser?._id.toString()}`, 'supposed to be access token', 3600);
	AppResponse(res, 200, updatedUser, 'Profile Successfully Updated');
});
