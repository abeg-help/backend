import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import xss from 'xss-clean';
import { ENVIRONMENT } from './common/config';
import { connectDb } from './common/config/database';
import AppError from './common/utils/appError';
import { stream } from './common/utils/logger';
import errorHandler from './controllers/errorController';
import { routeErrorHandlerWrapper } from './middlewares/catchAsyncErrors';
import { timeoutMiddleware } from './middlewares/timeout';
import { isAuthenticated } from './middlewares/auth.middleware';

/**
 *  uncaughtException handler
 */
process.on( 'uncaughtException', ( error: Error ) => {
  console.log( 'UNCAUGHT EXCEPTION! 💥 Server Shutting down...' );
  console.log( error.name, error.message );
  process.exit( 1 );
} );

/**
 * Default app configurations
 */
const app: Express = express();
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;

/**
 * App Security
 */
app.use( helmet() );
app.use( cors() );
app.use( express.json( { limit: '50mb' } ) );
app.use( express.urlencoded( { limit: '50mb', extended: true } ) );
app.disable( 'x-powered-by' );
// Data sanitization against NoSQL query injection
app.use( mongoSanitize() );
// Data sanitization against XSS
app.use( xss() );
// Prevent parameter pollution
app.use(
  hpp( {
    whitelist: [ 'date', 'createdAt' ], // whitelist some parameters
  } )
);

/**
 * Logger Middleware
 */
app.use( morgan( ENVIRONMENT.APP.ENV !== 'local' ? 'combined' : 'dev', { stream } ) );

app.use( ( req: Request, res: Response, next: NextFunction ) => {
  req[ 'requestTime' ] = new Date().toISOString();
  next();
} );

/**
 * Initialize routes
 */

app.use( isAuthenticated );

app.get( "/home", ( req, res ) => {

  res.send( { message: "home boy" } );
} );



// catch 404 and forward to error handler
app.all( '*', async () => {
  throw new AppError( 'route not found', 404 );
} );

/**
 * Error handler middlewares
 */
app.use( timeoutMiddleware );
app.use( errorHandler );
app.use( routeErrorHandlerWrapper );

/**
 * status check
 */
app.get( '*', ( req: Request, res: Response ) =>
  res.send( {
    Time: new Date(),
    status: 'Up and running',
  } )
);



/**
 * Bootstrap server
 */
const server = app.listen( port, () => {
  connectDb();
  console.log( '=> ' + appName + ' app listening on port ' + port + ' !' );
} );

/**
 * unhandledRejection  handler
 */

process.on( 'unhandledRejection', ( error: Error ) => {
  console.log( 'UNHANDLED REJECTION! 💥 Server Shutting down...' );
  console.log( error.name, error.message );
  server.close( () => {
    process.exit( 1 );
  } );
} );
