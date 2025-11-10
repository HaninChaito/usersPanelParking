// routes/notificationsRoutes.js
import express from 'express';
import { getNotifications } from '../controllers/notificationsController.js';
import authenticateToken from '../middlewares/authenticateToken.js';


const router = express.Router();

router.get('/notify', authenticateToken, getNotifications);

export default router;
