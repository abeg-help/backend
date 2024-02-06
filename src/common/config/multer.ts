import multer from 'multer';

const multerStorage = multer.memoryStorage();

export const multerUpload = multer({
	storage: multerStorage,
});
