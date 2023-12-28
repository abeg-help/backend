import { AppResponse, decodeData, removeFromCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { Request, Response } from 'express';
import { catchAsync } from '../../middlewares';
import { UserModel } from '../../models';

export const disable2fa = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;
	const { token } = req.body;

	if (!token) {
		throw new AppError('Token is required', 400);
	}

	const userFromDb = await UserModel.findOne({ email: user?.email }).select('+twoFA.recoveryCode');

	if (!userFromDb) {
		throw new AppError('User not found with provided email', 404);
	}

	let decodedRecoveryCode: Record<string, string[]>;
	try {
		decodedRecoveryCode = await decodeData(userFromDb.twoFA.recoveryCode!);
	} catch (e) {
		throw new AppError('Invalid recovery token', 400);
	}

	const trimmedToken = await token
		.replace(/\s/g, '')
		.replace(/(\d{6})/g, '$1 ')
		.trim();

	if (!decodedRecoveryCode.token || decodedRecoveryCode.token !== trimmedToken) {
		throw new AppError('Invalid recovery code', 400);
	}

	await UserModel.findByIdAndUpdate(userFromDb._id, {
		$unset: {
			twoFA: 1,
		},
	});

	await removeFromCache(userFromDb._id.toString());

	return AppResponse(res, 200, null, '2fa disabled successfully');
});
