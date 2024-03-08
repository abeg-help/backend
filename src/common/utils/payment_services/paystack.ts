import axios, { AxiosError } from 'axios';
import { ENVIRONMENT } from '../../config';
import { IInitializeTransaction } from '../../interfaces/paystack.interface';
import { axiosHandleError } from '../axios';

const paystackInstance = axios.create({
	baseURL: ENVIRONMENT.PAYSTACK.HOST,
	timeout: 1000 * 60 * 2,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		Authorization: `Bearer ${ENVIRONMENT.PAYSTACK.SECRET_KEY}`,
	},
});

export const initializeTransaction = async (data: IInitializeTransaction) => {
	try {
		const response = await paystackInstance.post('/transaction/initialize', data);

		return {
			success: true,
			data: response.data.data,
			message: response.data.message,
		};
	} catch (error) {
		const err = error as AxiosError;
		const { response } = axiosHandleError(err);

		return {
			success: false,
			data: response?.data ?? null,
			message: 'Error fetching banks',
		};
	}
};
