import express from 'express';
import { createOpinionController, getBookDetailController } from '../controllers/opinionController.js';

const router = express.Router();

router.post('/opinions', createOpinionController);
router.get('/books/id/:bookId', getBookDetailController);

export default router;
