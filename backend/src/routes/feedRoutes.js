import express from 'express';
import { getFeedController } from '../controllers/feedController.js';

const router = express.Router();

router.get('/feed/:user_id', getFeedController);

export default router;
