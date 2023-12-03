import {
	forgotPassword,
	protect,
	resetPassword,
	session,
	signIn,
	signUp,
	verifyEmail,
	signOut,
	setupTimeBased2fa,
	completeTimeBased2fa,
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
router.get('/signout', signOut);
router.post('/2fa/time/setup', setupTimeBased2fa);
router.post('/2fa/time/complete', completeTimeBased2fa);

export { router as authRouter };
