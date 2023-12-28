import { AppResponse, decodeData, removeFromCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { Request, Response } from 'express';
import { catchAsync } from '../../middlewares';
import { UserModel } from '../../models';

export const disable2fa = catchAsync(async (req: Request, res: Response) => {
	const { email, token } = req.body;

	if (!email || !token) {
		throw new AppError('Email and Token is required', 400);
	}

	const user = await UserModel.findOne({ email }).select('+twoFA.recoveryCode');

	if (!user) {
		throw new AppError('User not found with provided email', 404);
	}

	let decodedRecoveryCode: Record<string, string[]>;
	try {
		decodedRecoveryCode = await decodeData(user.twoFA.recoveryCode!);
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

	await UserModel.findByIdAndUpdate(user._id, {
		$unset: {
			twoFA: 1,
		},
	});

	await removeFromCache(user._id.toString());

	return AppResponse(res, 200, null, '2fa disabled successfully');
});
