import { NextFunction, Request, Response } from 'express';

type CatchAsyncFunction = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<any>;

const catchAsync = (fn: CatchAsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// Create a custom middleware to wrap route handlers
const routeErrorHandlerWrapper = (middleware: CatchAsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return catchAsync(middleware)(req, res, next);
  };
};

export { catchAsync, routeErrorHandlerWrapper };
