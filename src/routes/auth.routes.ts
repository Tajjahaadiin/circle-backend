import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import { authCheck } from '../middleware/auth-check.middleware';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/check', authCheck, AuthController.check);
router.post('/forgot-password');
router.post('/reset-password');

export default router;
