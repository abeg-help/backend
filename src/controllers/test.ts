import { Request, Response } from 'express';
import { addEmailToQueue } from 'src/queues/emailQueue';

export const test = (req: Request, res: Response) => {
	addEmailToQueue({
		type: 'passwordResetSuccessful',
		data: {
			to: 'obcbeats@gmail.com',
			priority: 'high',
		},
	});
	res.status(200).json({
		status: 'success',
		message: 'Test route',
	});
};
