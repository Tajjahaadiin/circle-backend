import express from 'express';
import likeController from '../controllers/like.controller';
import { authCheck } from '../middleware/auth-check.middleware';

const router = express.Router();

router.post('/', authCheck, likeController.createLike);
router.delete('/:threadId', authCheck, likeController.deleteLike);

export default router;
