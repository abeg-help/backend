import { twoFactorTypeEnum } from '@/common/constants';
import mongoose from 'mongoose';

export const TwoFAModel = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: Object.values(twoFactorTypeEnum),
			default: twoFactorTypeEnum.APP,
		},
		secret: {
			type: String,
			select: false,
		},
		recoveryCode: {
			type: String,
			select: false,
		},
		active: {
			type: Boolean,
			default: false,
		},
		verificationTime: {
			type: Date,
		},
		isVerified: {
			type: Boolean,
		},
	},
	{
		_id: false,
	}
);
