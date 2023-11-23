import { Request } from 'express';
import { Require_id } from 'mongoose';
import { IUser } from './user';

interface CustomRequest extends Request {
	user?: Require_id<IUser>;
}

export { CustomRequest };
