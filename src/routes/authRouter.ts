import { protect, forgotPassword, resetPassword, session, signIn, signUp } from '@/controllers';
import { editUserProfile } from '@/controllers/auth/editUserProfile';
import { Router } from 'express';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);

router.use(protect); // Protect all routes after this middleware
router.get('/session', session);
router.get('/user/updateProfile', editUserProfile);

export { router as authRouter };
