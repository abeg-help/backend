import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import type { CookieOptions, Response } from 'express';
import Redis from 'ioredis';
import jwt, { SignOptions } from 'jsonwebtoken';
import { promisify } from 'util';
import { ENVIRONMENT } from '../config';
import { IHashData } from '../interfaces/helper';
import { IUser } from '../interfaces/user';

if (!ENVIRONMENT.CACHE_REDIS.URL) {
	throw new Error('Cache redis url not found');
}
const redis = new Redis(ENVIRONMENT.CACHE_REDIS.URL!);

const toJSON = (obj: IUser, fields?: string[]): Partial<IUser> => {
	const user = JSON.parse(JSON.stringify(obj));

	if (fields && fields.length === 0) {
		return user;
	}

	const results = { ...user };

	if (fields && fields.length > 0) {
		for (const field of fields) {
			if (field in results) {
				delete results[field as keyof IUser];
			}
		}
		return results;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { refreshToken, loginRetries, lastLogin, password, updatedAt, ...rest } = user;
	return rest;
};

const generateRandomString = () => {
	return randomBytes(32).toString('hex');
};

const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 12);
};

const hashData = (data: IHashData, options?: SignOptions, secret?: string) => {
	return jwt.sign({ ...data }, secret ? secret : ENVIRONMENT.JWT.ACCESS_KEY, {
		expiresIn: options?.expiresIn || '15m',
	});
};

const decodeData = async (token: string, secret?: string) => {
	const verifyAsync: (arg1: string, arg2: string) => jwt.JwtPayload = promisify(jwt.verify);
	return await verifyAsync(token, secret ? secret : ENVIRONMENT.JWT.ACCESS_KEY!);
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

const removeFromCache = async (key: string) => {
	if (!key) {
		throw new Error('Invalid key provided');
	}

	const data = await redis.del(key);

	if (!data) {
		return null;
	}
	return data;
};

export {
	decodeData,
	generateRandomString,
	getFromCache,
	hashData,
	hashPassword,
	setCache,
	setCookie,
	removeFromCache,
	toJSON,
};
