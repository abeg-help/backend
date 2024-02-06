import { createCampaign, createCategory, getCategories, reviewCampaign } from '@/controllers';
import { protect } from '@/middlewares';
import express from 'express';
import { multerUpload } from '../common/config/multer';

const router = express.Router();

router.use(protect);
router.get('/categories', getCategories);
router.post('/category/create', createCategory);
router.post('/create/:step', multerUpload.array('photos'), createCampaign);
router.post('/review/:id', reviewCampaign);
export { router as campaignRouter };
