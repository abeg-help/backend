import { AppResponse, get2faCodeViaEmailHelper } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { Request, Response } from 'express';
import { catchAsync } from '../../middlewares';
import { twoFactorTypeEnum } from '../../common/constants';

export const get2faCodeViaEmail = catchAsync(async (req: Request, res: Response) => {
	const { user } = req;

	if (!user) {
		throw new AppError('Unauthorized');
	}

	if (user.twoFA.type !== twoFactorTypeEnum.EMAIL) {
		throw new AppError('Sorry, this action is only allowed for users with email-based two-factor authentication.', 400);
	}

	await get2faCodeViaEmailHelper(user.email);

	return AppResponse(res, 200, null, 'Code sent to email successfully');
});
