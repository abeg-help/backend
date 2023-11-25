import { protect } from '@/controllers';
import { editUserProfile } from '@/controllers/auth/editUserProfile';
import express from 'express';
const router = express.Router();

router.use(protect); // Protect all routes after this middleware
router.post('/updateProfile', editUserProfile);
export { router as userRouter };
