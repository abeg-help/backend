import { Gender, IDType, Provider, Role } from '@/common/constants';
import type { SignOptions } from 'jsonwebtoken';
import { Model } from 'mongoose';

interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	refreshToken: string;
	photo: string;
	role: Role;
	isProfileComplete: boolean;
	provider: Provider;
	phoneNumber: string;
	verificationToken: string;
	passwordResetToken: string;
	passwordResetExpires: Date;
	passwordResetRetries: number;
	passwordChangedAt: Date;
	ipAddress: string;
	loginRetries: number;
	address: string[];
	gender: Gender;
	verificationMethod: IDType;
	isIdVerified: boolean;
	isSuspended: boolean;
	isMobileVerified: boolean;
	isEmailVerified: boolean;
	isDeleted: boolean;
	accountRestoreToken: string;
	timeBased2FA: {
		active?: boolean;
		secret?: string;
		recoveryCode?: string;
	};
	lastLogin: Date;
	createdAt: Date;
	updatedAt: Date;
}

interface UserMethods extends Omit<IUser, 'toJSON'> {
	generateAccessToken(options?: SignOptions): string;
	generateRefreshToken(options?: SignOptions): string;
	verifyPassword(enteredPassword: string): Promise<boolean>;
	toJSON(excludedFields?: Array<keyof IUser>): object;
}

type UserModel = Model<UserMethods>;

export { IUser, UserMethods, UserModel };
