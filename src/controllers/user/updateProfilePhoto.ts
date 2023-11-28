import { catchAsync } from '@/middlewares';
import { CustomRequest, IUser } from '@/common/interfaces';
import { Response } from 'express';
import AppError from '@/common/utils/appError';
import { AppResponse, getFromCache, setCache, toJSON, uploadSingleFile } from '@/common/utils';
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
	).select('+photo')) as IUser & { _id: string };

	// update cache
	const prevCache = await getFromCache(updatedUser._id.toString());
	await setCache(updatedUser._id.toString()!, { ...toJSON(updatedUser, ['password']), ...Object(prevCache) });

	return AppResponse(res, 200, updatedUser, 'Profile photo updated successfully');
});
