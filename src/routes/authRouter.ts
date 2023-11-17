import { resetPassword, signInController, signUp } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/sign-up', signUp);
router.post('/reset-password', resetPassword);
router.post('/login', signInController);
router.post('/signup', signUp);

export { router as authRouter };
