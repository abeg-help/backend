import { Require_id } from 'mongoose';
import { Server } from 'socket.io';
import { IUser } from './user';

declare module 'express-serve-static-core' {
	interface Request {
		user?: Require_id<IUser>;
		io: Server;
		file?: Express.Multer.File;
	}
}
declare module 'socket.io' {
	interface Socket {
		user?: Require_id<IUser>;
	}
}
