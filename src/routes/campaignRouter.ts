import createCampaign from '@/controllers/campaign/create';
import { protect } from '@/controllers';
import express from 'express';
import { multerUpload } from '../common/config/multer';
const router = express.Router();

router.use(protect);
router.post('/create/:step', multerUpload.array('photos'), createCampaign);
export { router as campaignRouter };
