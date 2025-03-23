import express from 'express';
import * as threadController from '../controllers/thread.controller';
import { initCloudinary } from '../middleware/cloudinary.middleware';
import { uploadImage } from '../middleware/upload.middleware';
import { authCheck } from '../middleware/auth-check.middleware';
const router = express.Router();

router.get('/', authCheck, threadController.getThreads);
router.get('/:id', authCheck, threadController.getThreadById);
router.get('/profile/:userId', authCheck, threadController.getThreadsByuserID);
router.post(
  '/',
  authCheck,
  initCloudinary,
  uploadImage.single('images'),
  threadController.createThread,
);
router.post(
  '/:threadId',
  authCheck,
  initCloudinary,
  uploadImage.single('images'),
  threadController.updateThread,
);
router.delete(
  '/:threadId',
  authCheck,
  initCloudinary,
  threadController.deleteThread,
);

export default router;
