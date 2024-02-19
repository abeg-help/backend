import { Require_id } from 'mongoose';
import { Server } from 'socket.io';
import type { IUser } from './user';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: Require_id<IUser>;
			io: Server;
			file?: Express.Multer.File;
			location: string | null;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Socket {
		interface Socket {
			user?: Require_id<IUser>;
		}
	}
}
