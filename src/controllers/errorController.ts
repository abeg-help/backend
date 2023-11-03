import { NextFunction, Request, Response } from 'express';
import mongoose, { CastError, Error as MongooseError } from 'mongoose';
import { ENVIRONMENT } from '../common/config';
import AppError from '../common/utils/appError';
import { logger } from '../common/utils/logger';

// Define custom error types
type CustomError = AppError | MongooseError; // Add more custom error types as needed

type ErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => void;

// Error handling functions
const handleMongooseCastError = (err: CastError, req: Request, res: Response, next: NextFunction) => {
	const message = `Invalid ${err.path} value "${err.value}".`;
	next(new AppError(message, 400));
};

const handleMongooseValidationError = (
	err: MongooseError.ValidationError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	next(new AppError(message, 400));
};

const handleMongooseDuplicateFieldsError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
	// Extract value from the error message if it matches a pattern
	const matchResult = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
	if (matchResult && matchResult.length > 0) {
		const value = matchResult[0];
		const message = `Duplicate field value: ${value}. Please use a different value.`;
		next(new AppError(message, 409));
	} else {
		next(err);
	}
};

const handleJWTError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
	next(new AppError('Invalid token. Please log in again!', 401));
};

const handleJWTExpiredError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
	next(new AppError('Your token has expired! Please log in again.', 401));
};

const handleTimeoutError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
	next(new AppError('Request timeout', 408));
};

const sendErrorDev = (err: AppError, res: Response) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err: AppError, res: Response) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error('ERROR 💥', err);
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}
};

const errorHandler: ErrorHandler = (err, req, res, next) => {
	if (err instanceof AppError) {
		const { statusCode, message } = err;
		logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

		if (ENVIRONMENT.APP.ENV === 'production') {
			sendErrorProd(err, res);
		} else {
			sendErrorDev(err, res);
		}
	} else if (err instanceof mongoose.Error.CastError) {
		handleMongooseCastError(err, req, res, next);
	} else if (err instanceof MongooseError.ValidationError) {
		handleMongooseValidationError(err, req, res, next);
	} else if ('timeout' in err && err.timeout) {
		handleTimeoutError(err, req, res, next);
	} else if (err.name === 'JsonWebTokenError') {
		handleJWTError(err, req, res, next);
	} else if (err.name === 'TokenExpiredError') {
		handleJWTExpiredError(err, req, res, next);
	} else if ('code' in err && err.code === 11000) {
		handleMongooseDuplicateFieldsError(err, req, res, next);
	} else {
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
		logger.error(`unhandled error: ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
	}
};

export default errorHandler;
