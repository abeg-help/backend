import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { addEmailToQueue } from '@/queues/emailQueue';
import { Request, Response } from 'express';

export const test = catchAsync(async (req: Request, res: Response) => {
	console.log(req.body);

	if (req.body) throw new AppError('Test error without catchAsync wrapper', 400);

	addEmailToQueue({
		type: 'passwordResetSuccessful',
		data: {
			to: 'obcbeats@gmail.com',
			priority: 'high',
		},
	});
	return res.status(200).json({
		status: 'success',
		message: 'Test route',
	});
});
