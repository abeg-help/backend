import express from 'express';
import { paystackHook } from '../controllers/payment_hooks/paystack';
import * as expressIpFilter from 'express-ipfilter'; // Import the entire module
import { ENVIRONMENT } from '../common/config';
const { IpFilter } = expressIpFilter;

let allowedPaystackIps: string[];

if (ENVIRONMENT.APP.ENV === 'production') {
	allowedPaystackIps = ['52.31.139.75', '52.49.173.169', '52.214.14.220'];
} else {
	allowedPaystackIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
}

const router = express.Router();

router.post('/paystack/donation/verify', IpFilter(allowedPaystackIps, { mode: 'allow' }), paystackHook);

export { router as paymentHookRouter };
