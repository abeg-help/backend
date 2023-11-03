import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import xss from 'xss-clean';
import { ENVIRONMENT } from './common/config';
import { connectDb } from './common/config/database';
import { logger, stream } from './common/utils/logger';
import errorHandler from './controllers/errorController';
import { timeoutMiddleware, validateDataWithZod } from './middlewares';
import { emailQueue, emailQueueEvent, emailWorker, stopQueue } from './queues/emailQueue';
import { authRouter, userRouter } from './routes';

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
 * App Security
 */
app.use(helmet());
app.use(cors({ credentials: true, origin: true, allowedHeaders: ['Set-Cookie', 'Content-Type'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.disable('x-powered-by');
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
const server = app.listen(port, () => {
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
