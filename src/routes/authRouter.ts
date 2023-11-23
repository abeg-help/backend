import { protect, resetPassword, session, signIn, signUp, verifyEmail } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);

router.use(protect); // Protect all routes after this middleware
router.get('/session', session);

export { router as authRouter };
