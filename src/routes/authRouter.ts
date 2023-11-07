import { resetPassword, seedUser } from '@/controllers/resetPasswordController';
import { Router } from 'express';

const router = Router();

router.post('/request-reset-password', resetPassword);

router.get('/seed', seedUser);

export { router as authRouter };
