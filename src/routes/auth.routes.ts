import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import { authCheck } from '../middleware/auth-check.middleware';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/check', authCheck, AuthController.check);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', authCheck, AuthController.resetPassword);

export default router;
