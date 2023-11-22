import { IEnvironment } from '@/common/interfaces/environment';

export const ENVIRONMENT: IEnvironment = {
	APP: {
		NAME: process.env.APP_NAME,
		PORT: parseInt(process.env.PORT || process.env.APP_PORT || '3000'),
		ENV: process.env.NODE_ENV,
		CLIENT: process.env.FRONTEND_URL!,
	},
	DB: {
		URL: process.env.DB_URL!,
	},
	REDIS: {
		URL: process.env.QUEUE_REDIS_URL!,
		PASSWORD: process.env.QUEUE_REDIS_PASSWORD!,
		PORT: parseInt(process.env.QUEUE_REDIS_PORT!),
	},
	CACHE_REDIS: {
		URL: process.env.CACHE_REDIS_URL!,
	},
	EMAIL: {
		API_KEY: process.env.RESEND_API_KEY!,
	},
	JWT: {
		REFRESH_KEY: process.env.REFRESH_JWT_KEY!,
		ACCESS_KEY: process.env.ACCESS_JWT_KEY!,
	},
	JWT_EXPIRES_IN: {
		REFRESH: process.env.REFRESH_JWT_EXPIRES_IN!,
		ACCESS: process.env.ACCESS_JWT_EXPIRES_IN!,
	},
	FRONTEND_URL: process.env.FRONTEND_URL!,
};
