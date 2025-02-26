import multer from 'multer';
import path from 'path';

const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Example: 5MB limit
});
