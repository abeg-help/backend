import { Server, Socket } from 'socket.io';
import { socketDisconnected } from './handlers';

interface Event {
	name: string;
	handler: (arg: HandlerArg) => void;
}

interface HandlerArg {
	socket: Socket;
	io: Server;
	data: unknown;
	ackCallback: () => void;
}

const events: Event[] = [
	{
		name: 'disconnect',
		handler: socketDisconnected,
	},
];

export const socketController = (socket: Socket, io: Server) => {
	events.forEach((event: Event) => {
		socket.on(event.name, (data: unknown, ackCallback: () => void) => event.handler({ socket, io, data, ackCallback }));
	});
};
