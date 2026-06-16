//routes du fichier authController.js
import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();

// Route pour l'inscription
router.post('/signup', signup);
// Route pour la connexion
router.post('/login', login);
// Route pour la déconnexion
router.post('/logout', logout);

export default router;
