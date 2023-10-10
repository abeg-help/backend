import mongoose from 'mongoose';
import { ENVIRONMENT } from './environment';

export const connectDb = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENVIRONMENT.DB.URL);

    console.log('MongoDB Connected: ' + conn.connection.host);
  } catch (error) {
    console.log('Error: ' + (error as Error).message);
    process.exit(1);
  }
};
