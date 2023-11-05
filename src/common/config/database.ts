import mongoose from 'mongoose';
import { ENVIRONMENT } from './environment';

import { ConnectOptions } from 'mongoose';

interface CustomConnectOptions extends ConnectOptions {
	maxPoolSize?: number;
	minPoolSize?: number;
}

export const connectDb = async (): Promise<void> => {
	try {
		const conn = await mongoose.connect(ENVIRONMENT.DB.URL, {
			// minPoolSize: 100,
			// maxPoolSize: 100,
		} as CustomConnectOptions);

		console.log('MongoDB Connected to ' + conn.connection.name);
	} catch (error) {
		console.log('Error: ' + (error as Error).message);
		process.exit(1);
	}
};
