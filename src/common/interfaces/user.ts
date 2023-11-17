import { Gender, IDType, Provider, Role } from '@/common/constants';
import type { SignOptions } from 'jsonwebtoken';
import { Document, Model } from 'mongoose';

interface IUser extends Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	refreshToken: string;
	photo: string;
	role: Role;
	isProfileComplete: boolean;
	providers: Provider[];
	phoneNumber: string;
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
