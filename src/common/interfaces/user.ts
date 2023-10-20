import { Document } from 'mongoose';
import { Request } from 'express';
export interface IUserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  age: number;
  password: string;
}

export interface CustomRequest extends Request {
  user?: any;
}