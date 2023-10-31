import { Router } from 'express';
import { signUp } from 'src/controllers/auth';
import { validateDataWithZod } from 'src/middlewares/validateDataWithZod';
import { SignUpSchema } from 'src/schemas';

const router = Router();

router.post('/signup', validateDataWithZod(SignUpSchema), signUp);

export { router as authRoute };
