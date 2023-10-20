import { Response, NextFunction, Request } from 'express';
import AppError from 'src/common/utils/appError';

import { verifyJWT } from 'src/common/utils/helper';
import { asyncMiddleware } from './catchAsyncErrors';

/**
 * Middleware that checks if the user is authenticated by verifying the JWT token in the Authorization header.
 * If the token is valid, the user ID is added to the request body and the next middleware function is called.
 * If the token is invalid or missing, an error is thrown.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The Express next function.
 * @throws AppError if the token is invalid or missing.
 */
export const isAuthenticated = asyncMiddleware( async ( req: Request, res: Response, next: NextFunction ) => {
    const header = req.headers.authorization;

    // Check if the Authorization header is missing or does not start with "Bearer"
    if ( !header || header.startsWith( "Bearer" ) ) {
        return next( new AppError( "Not Authorized, Invalid token", 401 ) );
    }

    const token = header.split( " " )[ 1 ];
    if ( !token ) {
        return next( new AppError( "Not Authorized, Invalid token", 401 ) );
    }

    const payload = await verifyJWT( token );
    req.body = payload.userId;
    next();
} );