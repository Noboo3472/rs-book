import { getFeedForUser } from '../services/feedServices.js';

export const getFeedController = async (req, res) => {
  const { user_id } = req.params;
  try {
    const feed = await getFeedForUser(user_id);
    res.status(200).json({ feed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
