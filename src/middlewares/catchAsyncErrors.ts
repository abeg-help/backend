import { NextFunction, Request, Response } from 'express';

type CatchAsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;

// const catchAsync = (fn: CatchAsyncFunction) => {
// 	return async (req: Request, res: Response, next: NextFunction) => {
// 		try {
// 			const result = await fn(req, res, next);
// 			if (result instanceof Response) {
// 				return result;
// 			}
// 		} catch (err) {
// 			return next(err);
// 		}
// 	};
// };

const catchAsync = (fn: CatchAsyncFunction) => {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next);
	};
};

export { catchAsync };
