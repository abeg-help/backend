import { protect } from '@/controllers';
import express from 'express';
import getCategories from '../controllers/campaign/category/getCategories';
import createCategory from '../controllers/campaign/category/create';
const router = express.Router();

router.use(protect);
router.get('/', getCategories);
router.post('/', createCategory);
export { router as campaignCategoryRouter };
