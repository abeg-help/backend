import General from '@/controllers/campaign/create';
import { Protect } from '@/queues/middlewares/protect';
import express from 'express';
const router = express.Router();

router.use(Protect);
router.post('/create', General);
export { router as campaignRouter };
