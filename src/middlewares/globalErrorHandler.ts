import { NextFunction, Request, Response } from 'express';
import { ENVIRONMENT } from 'src/common/config';
import { errorConstants } from 'src/common/constants';

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	const statusCode = res.statusCode ?? 500;
	const stackTrace = ENVIRONMENT.APP.ENV === 'development' ? err.stack : {};
	const message = err.message ?? 'Something went wrong';

	// prettier-ignore
	const ERROR_LOOKUP = {
		[errorConstants.VALIDATION_ERROR]: () => res.status(400).json({ title: 'Validation Failed', message, stackTrace }),

		[errorConstants.UNAUTHORIZED]: () => res.status(401).json({ title: 'Unauthorized', message, stackTrace }),

		[errorConstants.FORBIDDEN]: () => res.status(403).json({ title: 'Forbidden', message, stackTrace }),

		[errorConstants.NOT_FOUND]: () => res.status(404).json({ title: 'Not Found', message, stackTrace }),

		[errorConstants.SERVER_ERROR]: () => res.status(500).json({ title: 'Internal Server Error', message, stackTrace }),

		default: () => res.status(500).json({ title: 'Something went wrong!', message, stackTrace }),
	};

	ERROR_LOOKUP[statusCode]?.() ?? ERROR_LOOKUP.default();
};

export { globalErrorHandler };
