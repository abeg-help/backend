import { AppResponse, generateRandom6DigitKey, hashData } from '../../common/utils';
import { catchAsync } from '../../middlewares';
import { Request, Response } from 'express';
import { UserModel } from '../../models';
import { addEmailToQueue } from '../../queues/emailQueue';

export const revokeRecoveryCode2fa = catchAsync(async (req: Request, res: Response) => {
	const user = req.user!;

	let recoveryCode: string = '';

	for (let i = 0; i < 6; i++) {
		recoveryCode += i == 5 ? `${generateRandom6DigitKey()}` : `${generateRandom6DigitKey()} `;
	}

	const hashedRecoveryCode = hashData({ token: recoveryCode }, { expiresIn: 0 });

	await UserModel.findByIdAndUpdate(user?._id, {
		timeBased2FA: {
			recoveryCode: hashedRecoveryCode,
		},
	});

	addEmailToQueue({
		type: 'revoke2FASecretCode',
		data: {
			to: user.email,
			priority: 'high',
			name: user.firstName,
		},
	});

	return AppResponse(
		res,
		200,
		{
			recoveryCode,
		},
		'Recovery code revoked successfully'
	);
});
