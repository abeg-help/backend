import { generateRandom6DigitKey, hashData, setCache } from '@/common/utils';
import AppError from '@/common/utils/appError';
import { addEmailToQueue } from '@/queues/emailQueue';
import { UserModel } from '../../models';

export const get2faCodeViaEmail = async (email) => {
	if (!email) {
		throw new AppError('Email is required', 400);
	}

	const user = await UserModel.findOne({ email });

	if (!user) {
		throw new AppError('No user found with provided email', 404);
	}

	const token = generateRandom6DigitKey();
	const hashedToken = hashData({ token }, { expiresIn: '5m' });

	await addEmailToQueue({
		type: 'get2faCodeViaEmail',
		data: {
			to: user.email,
			name: user.firstName,
			twoFactorCode: token,
			expiryTime: '5',
			priority: 'high',
		},
	});

	await setCache(`2FAEmailCode:${user._id.toString()}`, { token: hashedToken }, 300);
};
