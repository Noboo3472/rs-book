//Routes pour les fonctions commentaires
import {createCommentController,getCommentsController,deleteCommentsController} from '../controllers/commentsController.js';
import express from 'express';

const router = express.Router();

//Route de création de commentaires
router.post('/comments',createCommentController);
//Route de récupération de commentaires
router.get('/getComments/:publication_id',getCommentsController);
//Route de suppression de commentaires
router.delete('/deleteComment/:id', deleteCommentsController);

export default router;