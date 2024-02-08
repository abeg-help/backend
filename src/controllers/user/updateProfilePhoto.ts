import type { IUser } from '@/common/interfaces';
import { AppError, AppResponse, setCache, toJSON, uploadSingleFile } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import type { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { Require_id } from 'mongoose';

export const updateProfilePhoto = catchAsync(async (req: Request, res: Response) => {
	const { file } = req;
	const { user } = req;

	if (!file) {
		throw new AppError(`File is required`, 400);
	}

	const dateInMilliseconds = DateTime.now().toMillis();
	const fileName = `${user?._id}/profile-images/${dateInMilliseconds}.${file.mimetype.split('/')[1]}`;

	const photoUrl = await uploadSingleFile({
		fileName,
		buffer: file.buffer,
		mimetype: file.mimetype,
	});

	const updatedUser = (await UserModel.findByIdAndUpdate(
		user?._id,
		{
			photo: photoUrl,
		},
		{ new: true }
	)) as Require_id<IUser>;

	if (!updatedUser) {
		throw new AppError('User not found for update', 404);
	}

	await setCache(updatedUser._id.toString()!, { ...user, photo: photoUrl });

	return AppResponse(res, 200, toJSON(updatedUser), 'Profile photo updated successfully');
});
