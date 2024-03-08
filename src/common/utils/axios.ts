import { AxiosError } from 'axios';

export const axiosHandleError = (error: AxiosError) => {
	const { request, response } = error;

	let data = {};
	if (response) {
		data = {
			status: response.status,
			headers: response.headers,
			response: response.data || null,
		};

		if (response.status === 404) return data;

		return data;
	} else if (request) {
		return {
			...data,
			...error.request,
			message: 'Check internet connection',
		};
	} else {
		return { ...data, message: error.message };
	}
};
