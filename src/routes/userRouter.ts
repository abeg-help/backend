import express from 'express';
import { test } from '../controllers';
const router = express.Router();

router.post('/test', test);

export { router as userRouter };
