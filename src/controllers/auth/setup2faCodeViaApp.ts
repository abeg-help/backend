import { generateRandomBase32, generateTimeBased2fa, hashData, setCache } from '@/common/utils';
import { getFromCache, toJSON } from '@/common/utils';
import { Require_id } from 'mongoose';
import { UserModel } from '@/models';
import { IUser } from '@/common/interfaces';

export const get2faCodeViaApp = async (user) => {
	const secret = generateRandomBase32();
	const qrCode = await generateTimeBased2fa(secret);
	const hashedSecret = hashData({ token: secret }, { expiresIn: 0 });

	await UserModel.findByIdAndUpdate(user?._id, {
		timeBased2FA: {
			secret: hashedSecret,
		},
	});

	const userFromCache = await getFromCache<Require_id<IUser>>(user._id.toString());

	if (userFromCache) {
		// update cache
		await setCache(
			user._id.toString()!,
			toJSON({ ...userFromCache, timeBased2FA: { secret: hashedSecret, active: false } }, [])
		);
	}
	return { secret, qrCode };
};
