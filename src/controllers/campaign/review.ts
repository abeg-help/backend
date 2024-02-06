import { AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { processCampaign } from '@/queues/handlers/processCampaign';
import { Request, Response } from 'express';

// Note : this is for testing purpose and will be removed / changed to manual review for admin once the auto review implementation is completed.
export const reviewCampaign = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const result = await processCampaign(id);

	return AppResponse(res, 200, result, '');
});
