import express from 'express';
import { authCheck } from '../middleware/auth-check.middleware';
import * as replyController from '../controllers/reply.controller';
const router = express.Router();

router.get('/:threadId', authCheck, replyController.getRepliesByThreadId);
router.post('/:threadId', authCheck, replyController.createReply);

export default router;
