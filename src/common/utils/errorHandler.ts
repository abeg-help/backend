import timeout, { TimeoutOptions } from 'connect-timeout';
import { ENVIRONMENT } from '../config/environment';
import { logger } from './logger';
import { NextFunction, Request, Response } from 'express';

/**
 * Wraps an async function to handle errors.
 *
 * @param {function} fn - The async function to be wrapped.
 * @return {function} - The wrapped function.
 */
type catchAsync = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<any>;
export const catchAsync = (fn: catchAsync) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
  };
};

/**
 * Error handler
 */
export const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went wrong';
  err.data = err.data || null;

  const { statusCode, message, data } = err;

  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  if (err.timeout) {
    return res.status(408).send({
      success: false,
      data: null,
      message: 'Request timeout'
    });
  }

  if (statusCode === 404) {
    return res.status(statusCode).json({
      success: false,
      data: null,
      message: message ?? 'resource not found'
    });
  }

  if (ENVIRONMENT.APP.ENV === 'local') {
    console.log('==== Error ==== : ', err.stack);

    return res.status(statusCode).json({
      success: false,
      data: data,
      message: message,
      stackTrace: err.stack
    });
  }

  return res.status(statusCode).json({
    success: false,
    data: data,
    message: message
  });
};

/**
 * Timeout middleware
 */
// const timeoutOptions: TimeoutOptions = {

// }
export const timeoutMiddleware = timeout(600000);
