import { test } from '@/controllers';
import express from 'express';
const router = express.Router();

router.post('/test', test);

export { router as userRouter };
