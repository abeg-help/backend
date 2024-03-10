import express from 'express';
import { createDonation } from '@/controllers/donation/create';

const router = express.Router();

router.post('/create', createDonation);

export { router as donationRouter };
