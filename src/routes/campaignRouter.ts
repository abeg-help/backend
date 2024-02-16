import {
	createCampaign,
	deleteCampaign,
	createCategory,
	featuredCampaigns,
	getCategories,
	reviewCampaign,
	getAllCampaigns,
	getOneCampaign,
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
router.get('/categories', getCategories);
router.post('/category/create', createCategory);
router.post('/create/:step', multerUpload.array('photos', 5), createCampaign);
router.post('/review/:id', reviewCampaign);
router.post('/delete', deleteCampaign);

export { router as campaignRouter };
