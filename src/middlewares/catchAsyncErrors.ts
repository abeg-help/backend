import { NextFunction, Request, Response } from 'express';
import AppError from 'src/common/utils/appError';

type CatchAsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;

class CatchAsync {
	static wrap(fn: CatchAsyncFunction) {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				const result = await fn(req, res, next);
				if (result instanceof Response) {
					return result;
				}
			} catch (err) {
				if (err instanceof AppError) {
					return next(err);
				}
				return next(new AppError('An unexpected error occurred', 500));
			}
		};
	}
}

export { CatchAsync };
