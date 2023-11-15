import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import type { CookieOptions, Response } from 'express';
import Redis from 'ioredis';
import { ENVIRONMENT } from '../config';

if (!process.env.CACHE_REDIS_URL) {
	throw new Error('Cache redis url not found');
}
const redis = new Redis(process.env.CACHE_REDIS_URL!);

const generateRandomString = () => {
	return randomBytes(32).toString('hex');
};

const hashData = (data: string) => {
	return bcrypt.hashSync(data, 10);
};

const setCookie = (res: Response, name: string, value: string | number, options: CookieOptions = {}) => {
	res.cookie(name, value, {
		httpOnly: true,
		secure: ENVIRONMENT.APP.ENV === 'production',
		path: '/',
		sameSite: 'none',
		...options,
	});
};

const setCache = async (key: string, value: string | number | object | Buffer) => {
	if (!key) {
		throw new Error('Invalid key provided');
	}
	if (!value) {
		throw new Error('Invalid value provided');
	}

	if (typeof value === 'object' && !(value instanceof Buffer)) {
		value = JSON.stringify(value);
	}

	return await redis.set(key, value);
};

const getFromCache = async <T = string>(key: string) => {
	if (!key) {
		throw new Error('Invalid key provided');
	}

	const data = await redis.get(key);
	if (!data) {
		return null;
	}

	let parseData;
	try {
		parseData = JSON.parse(data);
	} catch (error) {
		parseData = data;
	}

	return parseData as T;
};

export { generateRandomString, getFromCache, hashData, setCache, setCookie };
