import { AppError, AppResponse, extractUAData, generateUniqueIdentifier } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import { donationModel } from '../../models/donationModel';
import { PaymentStatusEnum } from '../../common/constants';
import { initializeTransaction } from '../../common/utils/payment_services/paystack';
import { campaignModel } from '../../models';

export const createDonation = catchAsync(async (req: Request, res: Response) => {
	const { campaignId, donorEmail, donorName, amount, hideMyDetails } = req.body;

	if (!campaignId || !donorEmail || !donorName || !amount) {
		throw new AppError('All fields are required', 400);
	}

	const campaignExist = await campaignModel.findById(campaignId);

	if (!campaignExist) {
		throw new AppError('Error processing donation, try again later', 404);
	}

	const locationMeta = extractUAData(req);

	const reference = generateUniqueIdentifier();

	const donation = await donationModel.create({
		reference,
		campaignId,
		donorEmail,
		donorName,
		amount,
		donorIp: locationMeta.ipv4,
		donorIpMeta: locationMeta,
		paymentStatus: PaymentStatusEnum.UNPAID,
		hideDonorDetails: hideMyDetails,
	});

	if (!donation) {
		throw new AppError('Error processing donation, try again later', 500);
	}

	const paymentUrlResponse = await initializeTransaction({
		amount: amount * 100,
		email: donorEmail,
		reference,
		metadata: {
			campaignId,
		},
	});

	if (paymentUrlResponse) {
		return AppResponse(
			res,
			200,
			{ donation, paymentUrl: paymentUrlResponse.data.authorization_url },
			'Donation created successfully'
		);
	} else {
		throw new AppError('Error processing donation, try again later', 500);
	}
});
