import { resetPassword, signIn, signUp } from '@/controllers';
import { verifyEmail } from '@/controllers/auth/verifyEmail';
import { Router } from 'express';

const router = Router();

router.post('/signup', signUp);
router.post('/reset-password', resetPassword);
router.post('/signin', signIn);
router.get('/verify-email/:userId?', verifyEmail);

export { router as authRouter };
