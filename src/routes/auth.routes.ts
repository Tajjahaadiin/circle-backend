import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/check');
router.post('/forgot-password');
router.post('/reset-password');

export default router;
