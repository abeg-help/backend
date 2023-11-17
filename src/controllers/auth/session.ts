import { CustomRequest } from '@/common/interfaces';
import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';

export const session = catchAsync(async (req: CustomRequest) => {
	const currentUser = req.user;
	if (!currentUser) {
		throw new AppError('Unauthenticated', 401);
	}
});
