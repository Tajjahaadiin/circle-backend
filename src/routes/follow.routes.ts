import express from 'express';
import followController from '../controllers/follow.controller';
import { authCheck } from '../middleware/auth-check.middleware';
const router = express.Router();

router.post('/', authCheck, followController.createFollow);
router.delete('/:followedId', authCheck, followController.deleteFollow);
router.get('/followers/:userId', authCheck, followController.getFollowers);
router.get('/following/:userId', authCheck, followController.getFollowing);
export default router;
