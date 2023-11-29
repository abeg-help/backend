import { catchAsync } from '@/middlewares';
import { CustomRequest, IUser } from '@/common/interfaces';
import { Response } from 'express';
import AppError from '@/common/utils/appError';
import { AppResponse, deleteFile, getFromCache, setCache, toJSON, uploadSingleFile } from '@/common/utils';
import { DateTime } from 'luxon';
import { UserModel } from '@/models';

export const updateProfilePhoto = catchAsync(async (req: CustomRequest, res: Response) => {
	const { file } = req;

	if (!file) {
		throw new AppError(`File is required`, 400);
	}

	const fileName = `profile-photos/${DateTime.now().toMillis()}.${file.mimetype.split('/')[1]}`;

	const uploadedFile = await uploadSingleFile({
		fileName,
		buffer: file.buffer,
		mimetype: file.mimetype,
	});

	const updatedUser = (await UserModel.findByIdAndUpdate(
		req.user?._id,
		{
			$set: {
				photo: uploadedFile,
			},
		},
		{ new: true }
	).select('+photo +refreshToken')) as IUser & { _id: string };

	// delete previous photo from bucket
	const userFromCache = await getFromCache(updatedUser._id);
	if (userFromCache) {
		const splitItem = Object(userFromCache).photo.split('/');
		await deleteFile(`profile-photos/${splitItem[splitItem.length - 1]}`);
	}

	// update cache
	await setCache(updatedUser._id.toString()!, { ...toJSON(updatedUser), refreshToken: updatedUser.refreshToken });

	return AppResponse(res, 200, updatedUser, 'Profile photo updated successfully');
});
