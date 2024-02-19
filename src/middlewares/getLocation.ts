import { catchAsync } from '@/middlewares';
import type { NextFunction, Request, Response } from 'express';
import geoip from 'geoip-lite';

export const getLocation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const ip = req.clientIp;

	if (ip) {
		const location = geoip.lookup(ip);
		req.location = ((location?.city as string) + location?.country) as string;
	} else {
		req.location = null;
	}

	next();
});
