import { NextFunction, Request, Response } from 'express';
import { ENVIRONMENT } from 'src/common/config';
import AppError from '../../common/utils/appError';
import { logger } from '../../common/utils/logger';

type ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const handleCastErrorDB: ErrorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    const castError = err as any;
    const message = `Invalid ${castError.path}: ${castError.value}.`;
    next(new AppError(message, 400));
  } else {
    next(err);
  }
};

const handleDuplicateFieldsDB: ErrorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    const castError = err as any;
    // const value = castError.errmsg.match(/(["'])(\\[^]*?)\1/)[0]; // TODO: fix this regex
    const value = castError.errmsg.split('index: ')[1].split('_1')[0];
    const message = `${value} has already been used!`;
    next(new AppError(message, 400));
  } else {
    next(err);
  }
};

const handleValidationErrorDB: ErrorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    const validationError = err as any;
    const errors = Object.values(validationError.errors).map(
      (el: any) => el.message
    );
    const message = `Invalid input data. ${errors.join('. ')}`;
    next(new AppError(message, 400));
  } else {
    next(err);
  }
};

const handleJWTError: ErrorHandler = (err, req, res, next) => {
  next(new AppError('Invalid token. Please log in again!', 401));
};

const handleJWTExpiredError: ErrorHandler = (err, req, res, next) => {
  next(new AppError('Your token has expired! Please log in again.', 401));
};

const handleTimeoutError: ErrorHandler = (err, req, res, next) => {
  next(new AppError('Request timeout', 408));
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Something went wrong';

  const { statusCode, message, data } = err;
  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  if (ENVIRONMENT.APP.ENV === 'development') {
    sendErrorDev(err, res);
  } else if (ENVIRONMENT.APP.ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') handleCastErrorDB(error, req, res, next);
    else if (error.timeout) handleTimeoutError(error, req, res, next);
    else if (error.code === 11000)
      handleDuplicateFieldsDB(error, req, res, next);
    else if (error.name === 'ValidationError')
      handleValidationErrorDB(error, req, res, next);
    else if (error.name === 'JsonWebTokenError')
      handleJWTError(error, req, res, next);
    else if (error.name === 'TokenExpiredError')
      handleJWTExpiredError(error, req, res, next);
    else sendErrorProd(error, res);
  }
};

export default errorHandler;
