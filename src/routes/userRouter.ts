import express from 'express';
import { validateDataWithZod } from 'src/middlewares';
import { SignUpSchema } from 'src/schemas';
import { test } from '../controllers';
const router = express.Router();

router.post('/test', validateDataWithZod(SignUpSchema), test);

export { router as userRouter };
