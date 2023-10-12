export default class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  data?: string;

  constructor(message: string, statusCode: number, data?: string) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}
