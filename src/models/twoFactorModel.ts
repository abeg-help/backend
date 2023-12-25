import mongoose from 'mongoose';
import { twoFactorTypeEnum } from '../common/constants';

export const twoFactorSchema = new mongoose.Schema(
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
	},
	{
		_id: false,
	}
);
