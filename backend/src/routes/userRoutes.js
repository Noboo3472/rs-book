import express from 'express';
import { getUserById } from '../services/userServices.js';
import { getReviewsByUser } from '../services/opinionServices.js';

const router = express.Router();

router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:user_id/reviews', async (req, res) => {
  const { user_id } = req.params;
  try {
    const reviews = await getReviewsByUser(user_id);
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
