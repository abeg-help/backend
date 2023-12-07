import { AppResponse, generateRandom6DigitKey, setCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { addEmailToQueue } from '@/queues/emailQueue';
import { Request, Response } from 'express';
export const fallbackEmailForOTP = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;
	if (!user?._id) {
		throw new AppError('id is required', 401);
	}

	if (!user.timeBased2FA.active) {
		throw new AppError('User not enrolled for 2FA', 401);
	}

	const token = generateRandom6DigitKey();
	await addEmailToQueue({
		type: 'fallbackOTP',
		data: {
			to: user.email,
			name: user.firstName,
			token,
		},
	});
	await setCache(`2FAEmailCode:${user._id.toString()}`, token, 900);
	return AppResponse(res, 200, {}, 'OTP code sent to email successfully');
});
