export const socketDisconnected = async ({ socket, io, data, ackCallback }) => {
	console.log('disconnected', socket.id, io, data, ackCallback);
};
