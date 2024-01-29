import createCampaign from '@/controllers/campaign/create';
import { protect } from '@/controllers';
import express from 'express';
import { multerUpload } from '../common/config/multer';
import { reviewCampaign } from '../controllers/campaign/review';
const router = express.Router();

router.use(protect);
router.post('/create/:step', multerUpload.single('cover-photo'), createCampaign);
router.post('/review/:id', reviewCampaign);
export { router as campaignRouter };
