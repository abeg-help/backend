import { ENVIRONMENT } from '../../common/config';
import { AppResponse, generateRandomString, hashData, setCache, setCookie } from '../../common/utils';
import AppError from '../../common/utils/appError';
import { catchAsync } from '../../middlewares';
import { UserModel } from '../../models';
import { Request, Response } from 'express';
import { addEmailToQueue } from '../../queues/emailQueue';

export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;

	if (!user) {
		throw new AppError('Unauthenticated', 401);
	}

	await UserModel.deleteOne({ _id: user?._id });

	const accountRestorationToken = generateRandomString();
	const hashedAccountRestorationToken = hashData(
		{
			token: accountRestorationToken,
		},
		{
			expiresIn: '30d',
		}
	);

	const accountRestorationUrl = `${ENVIRONMENT.FRONTEND_URL}/account/restore?token=${hashedAccountRestorationToken}`;

	addEmailToQueue({
		type: 'deleteAccount',
		data: {
			to: user?.email,
			priority: 'high',
			name: user?.firstName,
			days: '30 days',
			restoreLink: accountRestorationUrl,
		},
	});

	// clear cache and cookies
	await setCache(user?._id.toString(), {});
	setCookie(res, 'abegAccessToken', 'expired', { maxAge: -1 });
	setCookie(res, 'abegRefreshToken', 'expired', { maxAge: -1 });

	return AppResponse(res, 200, null, 'Account deleted successfully');
});
