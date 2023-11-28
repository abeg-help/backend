import { protect } from '@/controllers';
import { editUserProfile } from '@/controllers/auth/editUserProfile';
import express from 'express';
import { multerUpload } from '@/common/config/multer';
import { updateProfilePhoto } from '@/controllers/user';
const router = express.Router();

router.use(protect); // Protect all routes after this middleware
router.post('/updateProfile', editUserProfile);
router.patch('/profile-photo', multerUpload.single('photo'), updateProfilePhoto);
export { router as userRouter };
