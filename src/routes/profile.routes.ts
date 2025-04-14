import express from 'express';
import { authCheck } from '../middleware/auth-check.middleware';
import * as profileController from '../controllers/profile.controller';
import { initCloudinary } from '../middleware/cloudinary.middleware';
import { uploadImage } from '../middleware/upload.middleware';
const router = express.Router();

router.post(
  '/',
  authCheck,
  initCloudinary,
  uploadImage.single('avatarUrl'),
  profileController.updateProfile,
);
export default router;
