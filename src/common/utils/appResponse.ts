import { Response } from 'express';

export function AppResponse(
	res: Response,
	statusCode: number = 200,
	data: Record<string, string[]> | unknown | string | null,
	message: string
) {
	res.status(statusCode).json({
		status: 'success',
		data: data ?? null,
		message: message ?? 'Success',
	});
}
