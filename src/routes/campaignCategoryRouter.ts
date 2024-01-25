import { protect } from '@/controllers';
import express from 'express';
import getCategories from '../controllers/campaign/category/getCategories';
import createCategory from '../controllers/campaign/category/create';
import updateCategory from '@/controllers/campaign/category/updateCategories';
import deleteCategory from '@/controllers/campaign/category/deleteCategories';
const router = express.Router();

router.use(protect);
router.get('/', getCategories);
router.post('/', createCategory);
router.post('/update/:categoryId', updateCategory);
router.post('/delete/', deleteCategory);
export { router as campaignCategoryRouter };
