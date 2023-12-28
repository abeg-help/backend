import {
	forgotPassword,
	get2faCodeViaEmail,
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
import { complete2faSetup } from '@/controllers/auth/complete2faSetup';
import { Router } from 'express';
import { disable2fa } from '../controllers/auth/disable2fa';

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
router.post('/2fa/setup', setupTimeBased2fa);
router.post('/2fa/complete', complete2faSetup);
router.post('/2fa/verify', verifyTimeBased2fa);
router.get('/2fa/code/email', get2faCodeViaEmail);
router.post('/2fa/disable', disable2fa);

export { router as authRouter };
