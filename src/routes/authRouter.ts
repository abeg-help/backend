import { resetPassword, signIn, signUp } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/sign-up', signUp);
router.post('/reset-password', resetPassword);
router.post('/login', signIn);
router.post('/signup', signUp);

export { router as authRouter };
