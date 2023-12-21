import { ENVIRONMENT } from '@/common/config';
import AppError from '@/common/utils/appError';
import { logger } from '@/common/utils/logger';
import { NextFunction, Response } from 'express';
import { CastError, Error as MongooseError } from 'mongoose';

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

const handleMongooseDuplicateFieldsError = (err, next: NextFunction) => {
	console.log(err);
	// Extract value from the error message if it matches a pattern

	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0]
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.split(/(?=[A-Z])/)
			.map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toLowerCase()))
			.join('');

		const value = err.keyValue[field];
		const message = `${field} "${value}" has already been used!.`;
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
	err.status = err.status || 'Error';

	if (ENVIRONMENT.APP.ENV === 'developmentss') {
		logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		sendErrorDev(err, res);
	} else {
		let error = err;
		if (err instanceof MongooseError.CastError) error = handleMongooseCastError(err);
		else if (err instanceof MongooseError.ValidationError) error = handleMongooseValidationError(err);
		if ('timeout' in err && err.timeout) error = handleTimeoutError();
		if (err.name === 'JsonWebTokenError') error = handleJWTError();
		if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
		if ((err as MongooseError) && err.code === 11000) error = handleMongooseDuplicateFieldsError(err, next);

		sendErrorProd(error, res);
	}
};

export default errorHandler;
