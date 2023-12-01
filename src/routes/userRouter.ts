import { multerUpload } from '@/common/config/multer';
import { protect } from '@/controllers';
import { editUserProfile } from '@/controllers/auth/editUserProfile';
import { deleteAccount, updateProfilePhoto } from '@/controllers/user';
import express from 'express';
const router = express.Router();

router.use(protect); // Protect all routes after this middleware
router.post('/updateProfile', editUserProfile);
router.post('/profile-photo', multerUpload.single('photo'), updateProfilePhoto);
router.delete('/', deleteAccount);
export { router as userRouter };
