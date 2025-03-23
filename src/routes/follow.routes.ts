import express from 'express';
import followController from '../controllers/follow.controller';
import { authCheck } from '../middleware/auth-check.middleware';
const router = express.Router();

router.post('/', authCheck, followController.createFollow);
router.delete('/:userId', authCheck, followController.deleteFollow);
export default router;
