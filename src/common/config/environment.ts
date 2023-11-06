import { IEnvironment } from '@/common/interfaces/environment';
import * as dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT: IEnvironment = {
	APP: {
		NAME: process.env.APP_NAME,
		PORT: parseInt(process.env.PORT || process.env.APP_PORT || '3000'),
		ENV: process.env.NODE_ENV,
	},
	DB: {
		URL: process.env.DB_URL!,
	},
	REDIS: {
		URL: process.env.QUEUE_REDIS_URL!,
		PASSWORD: process.env.QUEUE_REDIS_PASSWORD!,
		PORT: parseInt(process.env.QUEUE_REDIS_PORT!),
	},
	EMAIL: {
		API_KEY: process.env.RESEND_API_KEY!,
	},
};
