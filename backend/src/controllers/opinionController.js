import { createOpinionAndPublication, getBookWithReviews } from '../services/opinionServices.js';

export const createOpinionController = async (req, res) => {
  const { userId, bookId, rating, comment } = req.body;
  try {
    if (!userId || !bookId || typeof rating !== 'number') {
      return res.status(400).json({ error: 'userId, bookId et rating sont requis' });
    }

    const result = await createOpinionAndPublication(userId, bookId, rating, comment);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookDetailController = async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await getBookWithReviews(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Livre introuvable' });
    }
    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
