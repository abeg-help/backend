import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '../config';
import AppError from './appError';
export function generateRandomString( length: number ) {
  return randomBytes( length ).toString( 'hex' );
}

export function verifyJWT( token: string ) {
  try {
    const decoded = jwt.verify( token, ENVIRONMENT.JWT_SECRET_KEY );

    return decoded as ({userId});
  } catch ( error ) {
    throw new AppError( "invalid Token", 403 );
  }
}