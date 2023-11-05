import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

const generateRandomString = () => {
	return randomBytes(32).toString('hex');
};

const hashData = (data: string) => {
	return bcrypt.hashSync(data, 10);
};

export { generateRandomString, hashData };
