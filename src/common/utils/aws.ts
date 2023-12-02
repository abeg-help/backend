import AWS from 'aws-sdk';
import { ENVIRONMENT } from '../config';
import { IAwsUploadFile } from '../interfaces';
import { isValidFileNameAwsUpload } from './helper';
import AppError from './appError';

AWS.config.update({
	accessKeyId: ENVIRONMENT.AWS.ACCESS_KEY_ID,
	secretAccessKey: ENVIRONMENT.AWS.SECRET_ACCESS_KEY,
	region: ENVIRONMENT.AWS.REGION,
});

const s3 = new AWS.S3();
const bucketName = ENVIRONMENT.AWS.BUCKET_NAME;
const cloudFrontUrl = ENVIRONMENT.AWS.CLOUD_FRONT_URL;

const uploadSingleFile = async (payload: IAwsUploadFile): Promise<string> => {
	const { fileName, buffer, mimetype } = payload;

	if (!fileName || !buffer || !mimetype) {
		return '';
	}

	if (fileName && !isValidFileNameAwsUpload(fileName)) {
		throw new AppError('Invalid file name', 400);
	}

	return new Promise((resolve, reject) => {
		s3.upload(
			{
				Bucket: bucketName,
				Key: fileName,
				Body: buffer,
				ContentType: mimetype,
			},
			(error) => {
				if (error) {
					reject(new Error(`Error: ${error.message || 'File upload failed'}`));
				} else {
					resolve(`${cloudFrontUrl}/${fileName}`);
				}
			}
		);
	});
};

const uploadMultipleFiles = (files: IAwsUploadFile[]): Promise<string[]> => {
	return Promise.all(files.map((file) => uploadSingleFile(file)));
};

const deleteFile = async (fileName: string): Promise<boolean> => {
	if (!fileName) {
		return false;
	}

	return new Promise((resolve, reject) => {
		s3.deleteObject(
			{
				Bucket: bucketName,
				Key: fileName,
			},
			(error) => {
				if (error) {
					reject(new Error(`Error: ${error.message || 'File upload failed'}`));
				} else {
					resolve(true);
				}
			}
		);
	});
};

export { uploadSingleFile, uploadMultipleFiles, deleteFile };
