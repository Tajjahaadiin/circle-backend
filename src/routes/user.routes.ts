import express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();
router.get('/', userController.getUsers);
router.get('/search', userController.getUserSearch);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);
export default router;
