import { ENVIRONMENT } from '@/common/config';
import { connectDb } from '@/common/config/database';
import { logger, stream } from '@/common/utils/logger';
import errorHandler from '@/controllers/errorController';
import { timeoutMiddleware, validateDataWithZod } from '@/middlewares';
import { emailQueue, emailQueueEvent, emailWorker, stopQueue } from '@/queues/emailQueue';
import { authRouter, userRouter } from '@/routes';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import compression from 'compression';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet, { HelmetOptions } from 'helmet';
import { default as helmetCsp } from 'helmet-csp';
import hpp from 'hpp';
import morgan from 'morgan';
import xss from 'xss-clean';

/**
 *  uncaughtException handler
 */
process.on('uncaughtException', (error: Error) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Server Shutting down...');
	console.log(error.name, error.message);
	logger.error('UNCAUGHT EXCEPTION!! 💥 Server Shutting down... ' + new Date(Date.now()) + error.name, error.message);
	stopQueue();
	process.exit(1);
});

/**
 * Default app configurations
 */
const app: Express = express();
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;

// QUEUE
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/api/v1/queue');
createBullBoard({
	queues: [new BullMQAdapter(emailQueue)],
	serverAdapter,
});

/**
 * Compression Middleware
 */
app.use(compression());

/**
 * App Security
 */

// Rate limiter middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
});
app.use('/*', limiter);

// Middleware to allow CORS from frontend
app.use(
	cors({
		origin: ['https://your-real-frontend-url.com', 'http://localhost'], // TODO: change this to your frontend url
		credentials: true,
	})
);
// Configure Content Security Policy (CSP)
const contentSecurityPolicy = {
	directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", 'https://ajax.googleapis.com'], // TODO: change this to your frontend url, scripts and other trusted sources
		styleSrc: ["'self'", 'trusted-cdn.com', "'unsafe-inline'"], // TODO: change this to your frontend url, styles and other trusted sources
		imgSrc: ["'self'", 's3-bucket-url', 'data:'], // TODO: change this to your frontend url, images and other trusted sources
		frameAncestors: ["'none'"],
		objectSrc: ["'none'"],
		upgradeInsecureRequests: "'self'",
	},
};

// Use Helmet middleware for security headers
app.use(
	helmet({
		contentSecurityPolicy: false, // Disable the default CSP middleware
	})
);
// Use helmet-csp middleware for Content Security Policy
app.use(helmetCsp(contentSecurityPolicy));

const helmetConfig: HelmetOptions = {
	// X-Frame-Options header to prevent clickjacking
	frameguard: { action: 'deny' },
	// X-XSS-Protection header to enable browser's built-in XSS protection
	xssFilter: true,
	// Referrer-Policy header
	referrerPolicy: { policy: 'same-origin' },
	// Strict-Transport-Security (HSTS) header for HTTPS enforcement
	hsts: { maxAge: 15552000, includeSubDomains: true, preload: true },
};

app.use(helmet(helmetConfig));

// Secure cookies and other helmet-related configurations
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.permittedCrossDomainPolicies());
// Prevent browser from caching sensitive information
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
	res.set('Pragma', 'no-cache');
	res.set('Expires', '0');
	next();
});
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
	hpp({
		whitelist: ['date', 'createdAt'], // whitelist some parameters
	})
);

/**
 * Logger Middleware
 */
app.use(morgan(ENVIRONMENT.APP.ENV !== 'development' ? 'combined' : 'dev', { stream }));
// Add request time to req object
app.use((req: Request, res: Response, next: NextFunction) => {
	req['requestTime'] = new Date().toISOString();
	next();
});

/**
 * Initialize routes
 */

// catch 404 and forward to error handler
app.use(validateDataWithZod);
app.use('/api/v1/queue', serverAdapter.getRouter());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);

app.all('/*', async (req, res) => {
	logger.error('route not found ' + new Date(Date.now()) + ' ' + req.originalUrl);
	res.status(404).json({
		status: 'error',
		message: 'Invalid endpoint',
	});
});

/**
 * status check
 */
app.get('*', (req: Request, res: Response) =>
	res.send({
		Time: new Date(),
		status: 'Up and running',
	})
);

/**
 * Bootstrap server
 */
const server = app.listen(port, '0.0.0.0', () => {
	connectDb();
	console.log('=> ' + appName + ' app listening on port ' + port + '!');

	// start the email worker and queues
	(async () => {
		await emailQueue.waitUntilReady();
		await emailWorker.waitUntilReady();
		await emailQueueEvent.waitUntilReady();
	})();
});

/**
 * Error handler middlewares
 */
app.use(timeoutMiddleware);
app.use(errorHandler);

/**
 * unhandledRejection  handler
 */

process.on('unhandledRejection', (error: Error) => {
	console.log('UNHANDLED REJECTION! 💥 Server Shutting down...');
	console.log(error.name, error.message);
	logger.error('UNHANDLED REJECTION! 💥 Server Shutting down... ' + new Date(Date.now()) + error.name, error.message);
	stopQueue();
	server.close(() => {
		process.exit(1);
	});
});
