import { Request } from 'express';
import { IUser } from './user';

interface CustomRequest extends Request {
	user?: IUser;
}

export { CustomRequest };
