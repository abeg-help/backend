import { forgotPassword, resetPassword, signIn, signUp } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', signUp);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);
router.post('/signin', signIn);

export { router as authRouter };
