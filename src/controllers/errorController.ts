import { ENVIRONMENT } from '@/common/config';
import AppError from '@/common/utils/appError';
import { logger } from '@/common/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { CastError, Error as MongooseError } from 'mongoose';

// Define custom error types
type CustomError = AppError | MongooseError; // Add more custom error types as needed

// Error handling functions
const handleMongooseCastError = (err: CastError) => {
	const message = `Invalid ${err.path} value "${err.value}".`;
	return new AppError(message, 400);
};

const handleMongooseValidationError = (err: MongooseError.ValidationError) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
};

const handleMongooseDuplicateFieldsError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
	// Extract value from the error message if it matches a pattern
	const matchResult = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
	if (matchResult && matchResult.length > 0) {
		const value = matchResult[0];
		const message = `Duplicate field value: ${value}. Please use a different value.`;
		return new AppError(message, 409);
	} else {
		next(err);
	}
};

const handleJWTError = () => {
	return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
	return new AppError('Your token has expired!', 401);
};

const handleTimeoutError = () => {
	return new AppError('Request timeout', 408);
};

const sendErrorDev = (err: AppError, res: Response) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		error: err.data,
	});
};

const sendErrorProd = (err: AppError, res: Response) => {
	if (err?.isOperational) {
		console.log('Error: ', err);
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			error: err.data,
		});
	} else {
		console.log('Error: ', err);
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}
};

const errorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (ENVIRONMENT.APP.ENV === 'development') {
		logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		sendErrorDev(err, res);
	} else {
		let error = { ...err };
		if (err instanceof MongooseError.CastError) error = handleMongooseCastError(err);
		else if (err instanceof MongooseError.ValidationError) error = handleMongooseValidationError(err);
		if ('timeout' in err && err.timeout) error = handleTimeoutError();
		if (err.name === 'JsonWebTokenError') error = handleJWTError();
		if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
		if ('code' in err && err.code === 11000) error = handleMongooseDuplicateFieldsError(err, req, res, next);

		sendErrorProd(error, res);
	}
};

export default errorHandler;
