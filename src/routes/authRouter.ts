import {
	forgotPassword,
	protect,
	resetPassword,
	session,
	signIn,
	signUp,
	resendEmail,
	verifyEmail,
	signOut,
} from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);
router.post('/verify-email', verifyEmail);

router.use(protect); // Protect all routes after this middleware
router.get('/session', session);
router.get('/email/verify', resendEmail);
router.get('/signout', signOut);

export { router as authRouter };
