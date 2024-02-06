import { AppError } from '@/common/utils';
import type { Socket } from 'socket.io';

export const catchSocketAsync = (fn: (socket: Socket, next?: () => void) => Promise<void>) => {
	return (socket: Socket, next?: () => void) => {
		fn(socket, next).catch((err) => {
			if (err instanceof AppError) {
				console.log(err);
				// If it's an AppError, emit the error back to the client
				socket.emit('error', { message: err.message, status: err.status });
			} else {
				console.log(err);
				// If it's not an AppError, emit a generic error message
				socket.emit('error', { message: 'Something went wrong', status: 500 });
			}
			// Do not call next here
		});
	};
};
