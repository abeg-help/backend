import { NextFunction, Request, Response } from 'express';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

type CatchAsyncFunction = ( req: Request, res: Response, next?: NextFunction ) => Promise<any>;

const catchAsync = ( fn: CatchAsyncFunction ) => {
  return async ( req: Request, res: Response, next: NextFunction ) => {
    try {
      await fn( req, res, next );
    } catch ( err ) {
      next( err );
    }
  };
};

const asyncMiddleware = ( callback ) => {
  return async ( req: Request, res: Response, next: NextFunction ) => {
    try {
      await callback( req, res, next );
    } catch ( error ) {
      res.status( res.statusCode || StatusCodes.INTERNAL_SERVER_ERROR ).send( ReasonPhrases.INTERNAL_SERVER_ERROR );
    }
  };
};

// Create a custom middleware to wrap route handlers
const routeErrorHandlerWrapper = ( middleware: CatchAsyncFunction ) => {
  return ( req: Request, res: Response, next: NextFunction ) => {
    return catchAsync( middleware )( req, res, next );
  };
};

export { catchAsync, routeErrorHandlerWrapper, asyncMiddleware };
