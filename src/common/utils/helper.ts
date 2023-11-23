import { randomBytes } from 'crypto';
import type { CookieOptions, Response } from 'express';
import Redis from 'ioredis';
import { ENVIRONMENT } from '../config';
import { IHashData } from '../interfaces/helper';
import jwt, { SignOptions } from 'jsonwebtoken';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';

if (!ENVIRONMENT.CACHE_REDIS.URL) {
	throw new Error('Cache redis url not found');
}
const redis = new Redis(ENVIRONMENT.CACHE_REDIS.URL!);

const generateRandomString = () => {
	return randomBytes(32).toString('hex');
};

const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 12);
};

const hashData = (data: IHashData, options?: SignOptions) => {
	return jwt.sign({ ...data }, ENVIRONMENT.JWT.ACCESS_KEY, {
		expiresIn: options?.expiresIn || '15m',
	});
};

const decryptData = async (token: string) => {
	const verifyAsync: (arg1: string, arg2: string) => jwt.JwtPayload = promisify(jwt.verify);
	return await verifyAsync(token, ENVIRONMENT.JWT.ACCESS_KEY!);
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

const setCache = async (key: string, value: string | number | object | Buffer, expiry?: number) => {
	if (!key) {
		throw new Error('Invalid key provided');
	}
	if (!value) {
		throw new Error('Invalid value provided');
	}

	if (typeof value === 'object' && !(value instanceof Buffer)) {
		value = JSON.stringify(value);
	}

	if (expiry) {
		return await redis.set(key, value, 'EX', expiry);
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

export { generateRandomString, getFromCache, hashData, setCache, setCookie, hashPassword, decryptData };
