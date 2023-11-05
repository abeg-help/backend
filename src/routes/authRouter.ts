import { Router } from 'express';
import { resetPassword, seedUser } from '../controllers/resetPasswordController';

const router = Router();

router.post('/request-reset-password', resetPassword);

router.get('/seed', seedUser);

export { router as authRouter };
