import { AppResponse, generateRandom6DigitKey, hashData, setCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { addEmailToQueue } from '@/queues/emailQueue';
import { Request, Response } from 'express';
import { UserModel } from '../../models';

export const get2faCodeViaEmail = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) {
		throw new AppError('Email is required', 400);
	}

	const user = await UserModel.findOne({ email });

	if (!user) {
		throw new AppError('No user found with provided email', 404);
	}

	if (!user.timeBased2FA.receiveCodeViaEmail) {
		throw new AppError('Your account is not configured to receive 2FA code via email', 400);
	}

	const token = generateRandom6DigitKey();
	const hashedToken = hashData({ token }, { expiresIn: '5m' });

	await addEmailToQueue({
		type: 'get2faCodeViaEmail',
		data: {
			to: user.email,
			name: user.firstName,
			twoFactorCode: token,
			expiryTime: '5',
			priority: 'high',
		},
	});

	await setCache(`2FAEmailCode:${user._id.toString()}`, { token: hashedToken }, 300);
	return AppResponse(res, 200, null, 'OTP code sent to email successfully');
});
