import {
	completeTimeBased2fa,
	get2faCodeViaEmail,
	forgotPassword,
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
import { Protect } from '@/queues/middlewares/protect';
import { Router } from 'express';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/2fa/code/email', get2faCodeViaEmail);
router.post('/2fa/time/verify', verifyTimeBased2fa);

router.use(Protect); // Protect all routes after this middleware
router.get('/session', session);
router.get('/signout', signOut);
router.post('/2fa/time/setup', setupTimeBased2fa);
router.post('/2fa/time/complete', completeTimeBased2fa);

export { router as authRouter };
