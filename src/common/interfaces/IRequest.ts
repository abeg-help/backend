import { Require_id } from 'mongoose';
import { Server } from 'socket.io';
import { IUser } from './user';

// declare module 'express-serve-static-core' {
// 	interface Request {
// 		user?: Require_id<IUser>;
// 		io: Server;
// 		file?: Express.Multer.File;
// 	}
// }

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: Require_id<IUser>;
			io: Server;
			file?: Express.Multer.File;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Socket {
		interface Socket {
			user?: Require_id<IUser>;
		}
	}
}
// declare module 'socket.io' {
// 	interface Socket {
// 		user?: Require_id<IUser>;
// 	}
// }
