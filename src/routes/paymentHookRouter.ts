import express from 'express';
import { paystackHook } from '../controllers/payment_hooks/paystack';

const router = express.Router();

router.post('/paystack/donation/verify', paystackHook);

export { router as paymentHookRouter };
