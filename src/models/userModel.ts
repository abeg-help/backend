import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Gender, IDType, Role } from 'src/common/constants';
import { IUser, UserMethods } from 'src/common/interfaces';

type UserModel = Model<IUser, unknown, UserMethods>;

const userSchema = new mongoose.Schema<IUser, unknown, UserMethods>(
	{
		firstName: {
			type: String,
			min: [2, 'First name must be at least 2 characters long'],
			max: [50, 'First name must not be more than 50 characters long'],
			required: [true, 'First name is required'],
		},
		lastName: {
			type: String,
			min: [2, 'Last name must be at least 2 characters long'],
			max: [50, 'Last name must not be more than 50 characters long'],
			required: [true, 'Last name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email field is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			min: [8, 'Password must be at least 8 characters long'],
			required: [true, 'Password field is required'],
			select: false,
		},
		refreshToken: {
			type: String,
			select: false,
		},
		phoneNumber: {
			type: String,
			unique: true,
			select: false,
		},
		photo: {
			type: String,
		},
		role: {
			type: String,
			enum: Object.values(Role),
			default: Role.User,
			select: false,
		},
		isProfileComplete: {
			type: Boolean,
			default: false,
			select: false,
		},
		providers: {
			type: [String],
			select: false,
		},
		passwordResetToken: {
			type: String,
			select: false,
		},
		passwordResetExpires: {
			type: Date,
			select: false,
		},
		passwordChangedAt: {
			type: Date,
			select: false,
		},
		ipAddress: {
			type: String,
			select: false,
		},
		loginRetries: {
			type: Number,
			default: 0,
			select: false,
		},
		gender: {
			type: String,
			enum: Object.values(Gender),
			select: false,
		},
		verificationMethod: {
			type: String,
			enum: Object.values(IDType),
			select: false,
		},
		isIdVerified: {
			type: Boolean,
			default: false,
			select: false,
		},
		isSuspended: {
			type: Boolean,
			default: false,
			select: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
			select: false,
		},
		isMobileVerified: {
			type: Boolean,
			default: false,
			select: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
		lastLogin: {
			type: Date,
			select: false,
		},
	},
	{ timestamps: true }
);

// only pick users that have are not deleted || suspended
userSchema.pre(/^find/, function (this: Model<IUser>, next) {
	this.find({ isDeleted: { $ne: true }, isSuspended: { $ne: true } });
	next();
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
	if (!this.isProfileComplete) {
		const profiles = [
			this.firstName,
			this.lastName,
			this.email,
			this.phoneNumber,
			this.photo,
			this.address.length,
			this.gender,
			this.isIdVerified,
			this.isMobileVerified,
			this.isEmailVerified,
		];
		this.isProfileComplete = profiles.every((profile) => Boolean(profile));
	}

	if (this.password && this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
	}
	next();
});

// Verify user password
userSchema.method('verifyPassword', async function (this: HydratedDocument<IUser>, enteredPassword: string) {
	if (!this.password) {
		return false;
	}
	const isValid = await bcrypt.compare(enteredPassword, this.password);
	return isValid;
});

userSchema.method('generateAuthToken', function (this: HydratedDocument<IUser>) {
	// Implement functionality to generate auth token for user
});

userSchema.method('generateRefreshToken', function (this: HydratedDocument<IUser>) {
	// Implement functionality to generate refresh token for user
});

export default mongoose.model<IUser, UserModel>('User', userSchema);
