import express from 'express';
import { currentUser, getAllUsers, login, logout, register, sendVerifyEmail, verifyEmail } from '../controllers/UserController.js';
import { Authorize } from '../middleware/Authorize.js';

const router = express.Router();
router.get('/users', Authorize, getAllUsers);
router.get('/user', Authorize, currentUser);
router.get('/users/verify-email/:token', verifyEmail);
router.get('/users/send-verify-email', sendVerifyEmail);
router.post('/login', login);
router.post('/logout', Authorize, logout);
router.post('/register', register);

export default router;