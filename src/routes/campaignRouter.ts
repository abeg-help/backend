import {
	createCampaign,
	deleteCampaign,
	createOrUpdateCategory,
	featuredCampaigns,
	getCategories,
	reviewCampaign,
	getAllCampaigns,
	getOneCampaign,
	deleteCategory,
	publishCampaign,
	getCampaignStats,
} from '@/controllers';
import { protect } from '@/middlewares';
import express from 'express';
import { multerUpload } from '@/common/config';

const router = express.Router();

router.get('/featured', featuredCampaigns);
router.get('/all', getAllCampaigns);
router.get('/one/:shortId', getOneCampaign);
router.get('/user/:userId', getAllCampaigns);

router.use(protect);
// campaign category
router.post('/publish', publishCampaign);
router.get('/categories', getCategories);
router.post('/category', multerUpload.single('image'), createOrUpdateCategory);
router.post('/category/delete', deleteCategory);
router.get('/analytics', getCampaignStats);

// campaign
router.post('/create/:step', multerUpload.array('photos', 5), createCampaign);
router.post('/review/:id', reviewCampaign);
router.post('/delete', deleteCampaign);

export { router as campaignRouter };
