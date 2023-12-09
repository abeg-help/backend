import {
	completeTimeBased2fa,
	fallbackEmailForOTP,
	forgotPassword,
	protect,
	resendVerification,
	resetPassword,
	session,
	setupTimeBased2fa,
	signIn,
	signOut,
	signUp,
	verifyEmail,
	verifyTimeBased2fa,
} from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

router.use(protect); // Protect all routes after this middleware
router.get('/session', session);
router.get('/signout', signOut);
router.post('/2fa/time/setup', setupTimeBased2fa);
router.post('/2fa/time/complete', completeTimeBased2fa);
router.post('/2fa/email-fallback', fallbackEmailForOTP);
router.post('/2fa/time/verify', verifyTimeBased2fa);

export { router as authRouter };
