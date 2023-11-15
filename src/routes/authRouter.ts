import { Router } from 'express';
import { resetPassword, seedUser } from '@/controllers/resetPasswordController';
import { signUp } from '@/controllers/auth/signup';

const router = Router();

router.post('/sign-up', signUp);
router.post('/request-reset-password', resetPassword);
router.get('/seed', seedUser);

export { router as authRouter };
