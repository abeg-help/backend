import { AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import { createHmac } from 'crypto';
import { ENVIRONMENT } from '@/common/config';
import { processDonationCompleted } from '../donation/processCompleteDonation';
import { IProcessDonationCompleted } from '@/common/interfaces/donation.interface';

export const paystackHook = catchAsync(async (req: Request, res: Response) => {
	console.log('==== paystackHook ====');

	//validate event
	const hash = createHmac('sha512', ENVIRONMENT.PAYSTACK.SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');

	if (hash == req.headers['x-paystack-signature']) {
		const event = req.body;

		if (event.event === 'charge.success') {
			const payload: IProcessDonationCompleted = {
				campaignId: event.data.metadata.campaignId,
				paidAt: event.data.paid_at,
				reference: event.data.reference,
				status: event.data.status,
				amount: parseFloat(event.data.amount) / 100,
			};
			await processDonationCompleted(payload, event);
		}
	}

	return AppResponse(res, 200, null, 'Success');
});
