import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';

const firstStep = catchAsync(async (req: Request, res: Response) => {
	console.log(res, req);
});

export default firstStep;
