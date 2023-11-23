import AWS from 'aws-sdk';
import { ENVIRONMENT } from '../config';
import { IAwsUploadFile } from '../interfaces';

AWS.config.update({
	accessKeyId: ENVIRONMENT.AWS.ACCESS_KEY_ID,
	secretAccessKey: ENVIRONMENT.AWS.SECRET_ACCESS_KEY,
	region: ENVIRONMENT.AWS.REGION,
});

const s3 = new AWS.S3();
const bucketName = ENVIRONMENT.AWS.BUCKET_NAME;
const cloudFrontUrl = ENVIRONMENT.AWS.CLOUD_FRONT_URL;

const uploadSingleFile = async (file: IAwsUploadFile): Promise<string> => {
	const fileName = `${Date.now()}-${file.originalname}`;
	return new Promise((resolve, reject) => {
		s3.upload(
			{
				Bucket: bucketName,
				Key: fileName,
				Body: file.buffer,
				ContentType: file.mimetype,
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

export { uploadSingleFile, uploadMultipleFiles };
