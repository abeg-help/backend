import { createCampaign, createCategory, getCategories, reviewCampaign } from '@/controllers';
import { protect } from '@/middlewares';
import express from 'express';
import { multerUpload } from '@/common/config';
import { deleteCampaign } from '@/controllers/campaign/delete';

const router = express.Router();

router.use(protect);
router.get('/categories', getCategories);
router.post('/category/create', createCategory);
router.post('/create/:step', multerUpload.array('photos', 5), createCampaign);
router.post('/review/:id', reviewCampaign);
router.post('/delete', deleteCampaign);
export { router as campaignRouter };
