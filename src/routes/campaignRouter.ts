import { createCampaign, createOrUpdateCategory, getCategories, reviewCampaign } from '@/controllers';
import { protect } from '@/middlewares';
import express from 'express';
import { multerUpload } from '@/common/config';
import { deleteCampaign } from '@/controllers/campaign/delete';
import { deleteCategory } from '../controllers/campaign/category/delete';

const router = express.Router();

router.use(protect);
// campaign category
router.get('/categories', getCategories);
router.post('/category', multerUpload.single('image'), createOrUpdateCategory);
router.post('/category/delete', deleteCategory);

// campaign
router.post('/create/:step', multerUpload.array('photos', 5), createCampaign);
router.post('/review/:id', reviewCampaign);
router.post('/delete', deleteCampaign);
export { router as campaignRouter };
