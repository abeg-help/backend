import { resetPassword, resetPasswordComplete, signIn, signUp } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', signUp);
router.post('/password/reset/request', resetPassword);
router.post('/password/reset', resetPasswordComplete);
router.post('/signin', signIn);

export { router as authRouter };
