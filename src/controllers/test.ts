import { Request, Response } from 'express';
import AppError from 'src/common/utils/appError';
import { addEmailToQueue } from 'src/queues/emailQueue';

export const test = async (req: Request, res: Response) => {
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
};
