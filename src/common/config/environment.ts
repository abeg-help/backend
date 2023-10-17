import * as dotenv from 'dotenv';
import { IEnvironment } from '../interfaces/environment';
dotenv.config();

export const ENVIRONMENT: IEnvironment = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: process.env.PORT || 6000,
    ENV: process.env.APP_ENV,
    AUTH_EMAIL: process.env.AUTH_EMAIL,
    AUTH_PASS: process.env.AUTH_PASS,
  },
  DB: {
    URL: process.env.DB_URL!,
  },
};
