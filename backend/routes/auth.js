import express from 'express';
import { login, sendEmail , CreateAccount , setPassword } from '../controllers/authController.js';



const router = express.Router();

router.post('/login', login);
router.post('/CreateAccount', CreateAccount);
router.post('/send-email', sendEmail);
router.post('/set-password', setPassword);

export default router;
