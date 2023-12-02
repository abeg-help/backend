import { Require_id } from 'mongoose';
import Multer from 'multer';
import { Server } from 'socket.io';
import { IUser } from './user';

declare module 'express-serve-static-core' {
	interface Request {
		user?: Require_id<IUser>;
		io: Server;
		file?: Multer.File;
	}
}
