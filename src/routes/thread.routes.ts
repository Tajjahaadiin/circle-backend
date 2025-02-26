import express from 'express';
import * as threadController from '../controllers/thread.controller';
import { initCloudinary } from '../middleware/cloudinary.middleware';
import { uploadImage } from '../middleware/upload.middleware';
import { authCheck } from '../middleware/auth-check.middleware';
const router = express.Router();

router.get('/', threadController.getThreads);
router.get('/:id', threadController.getThreadById);
router.post(
  '/',
  authCheck,
  initCloudinary,
  uploadImage.single('images'),
  threadController.createThread,
);

export default router;
