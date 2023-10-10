import AppError from '../../common/utils/appError';
import { catchAsync } from '../../common/utils/errorHandler';

export const getUser = catchAsync(async (req, res) => {
  const user = {
    name: 'jc',
    email: 'coder'
  };

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return res.status(200).json(user);
});
