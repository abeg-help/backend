import type { IEnvironment } from '@/common/interfaces';

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
	R2: {
		ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
		SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
		REGION: process.env.R2_REGION!,
		BUCKET_NAME: process.env.R2_BUCKET_NAME!,
		ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
		CDN_URL: process.env.R2_CDN_URL!,
	},
	GEMINI: {
		API_KEY: process.env.GEMINI_API_KEY!,
	},
};
