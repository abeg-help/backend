import { ENVIRONMENT } from '@/common/config';
import type { IAwsUploadFile } from '@/common/interfaces';
import AppError from './appError';
import { isValidFileNameAwsUpload } from './helper';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { encode } from 'blurhash';

if (
	!ENVIRONMENT.R2.ACCOUNT_ID ||
	!ENVIRONMENT.R2.REGION ||
	!ENVIRONMENT.R2.ACCESS_KEY_ID ||
	!ENVIRONMENT.R2.SECRET_ACCESS_KEY ||
	!ENVIRONMENT.R2.BUCKET_NAME ||
	!ENVIRONMENT.R2.CDN_URL
) {
	throw new Error('R2 environment variables are not set');
}

// S3 client configuration
export const r2 = new S3Client({
	region: ENVIRONMENT.R2.REGION,
	endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
		secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
	},
});

//create image hash
const encodeImageToHash = (path) =>
	new Promise((resolve, reject) => {
		sharp(path)
			.raw()
			.ensureAlpha()
			.resize(32, 32, { fit: 'inside' })
			.toBuffer((err, buffer, { width, height }) => {
				if (err) return reject(err);
				resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
			});
	});

export const uploadSingleFile = async (payload: IAwsUploadFile): Promise<{ secureUrl: string; blurHash?: string }> => {
	const { fileName, buffer, mimetype } = payload;

	if (!fileName || !buffer || !mimetype) {
		throw new AppError('File name, buffer and mimetype are required', 400);
	}

	if (fileName && !isValidFileNameAwsUpload(fileName)) {
		throw new AppError('Invalid file name', 400);
	}

	let bufferFile = buffer;

	if (mimetype.includes('image')) {
		bufferFile = await sharp(buffer)
			.resize({
				height: 1920,
				width: 1080,
				fit: 'contain',
			})
			.toBuffer();
	}

	const uploadParams = {
		Bucket: ENVIRONMENT.R2.BUCKET_NAME,
		Key: fileName,
		Body: bufferFile,
		ContentType: mimetype,
	};

	try {
		const command = new PutObjectCommand(uploadParams);
		await r2.send(command);
		const secureUrl = `${ENVIRONMENT.R2.CDN_URL}/${fileName}`;

		const hash = mimetype.includes('image') ? ((await encodeImageToHash(buffer)) as string) : '';

		console.log({
			secureUrl,
			hash,
		});

		return {
			secureUrl: secureUrl,
			blurHash: hash,
		};
	} catch (error) {
		console.log(error);
		return {
			secureUrl: '',
			blurHash: '',
		};
	}
};
