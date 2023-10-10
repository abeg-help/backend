import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { ENVIRONMENT } from './common/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import { stream } from './common/utils/logger';
import { connectDb } from './common/config/database';
import AppError from './common/utils/appError';
import { catchAsync, handleError, timeoutMiddleware } from './common/utils';

/**
 * Default app configurations
 */
const app: Express = express();
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;

/**
 * App Security
 */
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.disable('x-powered-by');

/**
 * Logger Middleware
 */
app.use(
  morgan(ENVIRONMENT.APP.ENV !== 'local' ? 'combined' : 'dev', { stream })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  req['requestTime'] = new Date().toISOString();
  next();
});

/**
 * Initialize routes
 */

// catch 404 and forward to error handler
app.all(
  '*',
  catchAsync(async (req: Request, res: Response) => {
    throw new AppError('route not found', 404);
  })
);

/**
 * Error handler middlewares
 */
app.use(timeoutMiddleware);
app.use(handleError);

/**
 * status check
 */
app.get('*', (req: Request, res: Response) =>
  res.send({
    Time: new Date(),
    status: 'running'
  })
);

/**
 * Bootstrap server
 */
app.listen(port, () => {
  connectDb();
  console.log('=> ' + appName + ' app listening on port ' + port + ' !');
});
