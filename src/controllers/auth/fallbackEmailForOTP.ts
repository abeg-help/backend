import { IUser } from '@/common/interfaces';
import { AppResponse, generateRandom6DigitKey, getFromCache, setCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { UserModel } from '@/models';
import { addEmailToQueue } from '@/queues/emailQueue';
import { Request, Response } from 'express';
import { Require_id } from 'mongoose';
export const fallbackEmailForOTP = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.body;
	if (!id) {
		throw new AppError('id is required', 401);
	}

	const user = await getFromCache<Require_id<IUser>>(id.toString());
	if (!user) {
		throw new AppError('Unauthenticated', 401);
	}
	if (!user.timeBased2FA.active) {
		throw new AppError('2FA is not active', 401);
	}
	const isTokenUsed = user.emailBackupToken.used;
	if (isTokenUsed) {
		throw new AppError('Backup token is already used', 401);
	}
	const token = generateRandom6DigitKey();
	addEmailToQueue({
		type: 'fallbackOTP',
		data: {
			to: user.email,
			name: user.firstName,
			token,
		},
	});
	const updatedUser = await UserModel.findOneAndUpdate({ _id: user._id }, { emailBackupToken: { token: token } });
	if (updatedUser) {
		await setCache(user._id.toString()!, updatedUser);
	}
	return AppResponse(res, 200, {}, 'OTP verified successfully');
});
