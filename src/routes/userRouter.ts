import { multerUpload } from '@/common/config/multer';
import { editUserProfile } from '@/controllers/user/editUserProfile';
import { deleteAccount, restoreAccount, updateProfilePhoto } from '@/controllers/user';
import express from 'express';
import { Protect } from '@/middlewares/protect';
const router = express.Router();

router.post('/restore', restoreAccount);

router.use(Protect); // Protect all routes after this middleware
router.post('/updateProfile', editUserProfile);
router.post('/profile-photo', multerUpload.single('photo'), updateProfilePhoto);
router.delete('/', deleteAccount);
export { router as userRouter };
