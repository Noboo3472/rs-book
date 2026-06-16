//Routes pour la gestion des publication

import express from 'express';
import {publicationsController,deletePublicationController,getPublicationById,getPublicationByAuthor} from '../controllers/publicationController.js'


const router = express.Router();

//Route de création de publication
router.post('/publications', publicationsController);
//Route de suppression de publication
router.delete('/deletePublication/:id', deletePublicationController);
//Route de récupération de publication par Id
router.get('/publication/:id', getPublicationById)
//Route de récupération de publication par auteur
router.get('/publicationbyauthor/:user_id', getPublicationByAuthor)

export default router;