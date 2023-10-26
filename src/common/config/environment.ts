import * as dotenv from 'dotenv';
import { IEnvironment } from '../interfaces/environment';
dotenv.config();

export const ENVIRONMENT: IEnvironment = {
	APP: {
		NAME: process.env.APP_NAME,
		PORT: process.env.PORT || 3000,
		ENV: process.env.APP_ENV,
	},
	DB: {
		URL: process.env.DB_URL!,
	},
};
