//Routes pour les fonctions de follow
import express from 'express';
import { followUserController, unfollowUserController, getFollowersController, getFollowingsController } from '../controllers/followControllers.js';

const router = express.Router();

//Route pour suivre un utilisateur
router.post('/follow', followUserController);

//Route pour unfollow un utilisateur
router.post('/unfollow', unfollowUserController);

//Route pour récupérer les followers d'un utilisateur
router.get('/followers/:userId', getFollowersController);

//Route pour récupérer les followings d'un utilisateur
router.get('/followings/:userId', getFollowingsController);

export default router;