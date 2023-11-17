import { protect, session, test } from '@/controllers';
import express from 'express';
const router = express.Router();

router.post('/test', test);

router.use(protect);
router.get('/session', session);

export { router as userRouter };
