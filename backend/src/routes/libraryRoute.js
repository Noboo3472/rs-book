import express from 'express';
import {
  addBookToLibrary,
  getUserLibrary,
  markBookAsRead,
  markBookAsUnread,
  removeBookFromLibrary,
  searchBooks,
  searchUsers,
} from '../services/libraryServices.js';

const router = express.Router();

// Route pour ajouter un livre à la bibliothèque
router.post('/library/add', async (req, res) => {
  const { user_id, book_id } = req.body;
  try {
    if (!user_id || !book_id) {
      return res.status(400).json({ error: 'user_id et book_id sont requis' });
    }

    const result = await addBookToLibrary(user_id, book_id);
    res.status(201).json({
      message: 'Livre ajouté à la bibliothèque avec succès',
      library: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer la bibliothèque d'un utilisateur
router.get('/library/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const library = await getUserLibrary(user_id);
    res.status(200).json({
      message: 'Bibliothèque récupérée avec succès',
      library,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour marquer un livre comme lu
router.put('/library/mark-read', async (req, res) => {
  const { user_id, book_id } = req.body;
  try {
    if (!user_id || !book_id) {
      return res.status(400).json({ error: 'user_id et book_id sont requis' });
    }

    const result = await markBookAsRead(user_id, book_id);
    res.status(200).json({
      message: 'Livre marqué comme lu',
      library: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour marquer un livre comme non lu
router.put('/library/mark-unread', async (req, res) => {
  const { user_id, book_id } = req.body;
  try {
    if (!user_id || !book_id) {
      return res.status(400).json({ error: 'user_id et book_id sont requis' });
    }

    const result = await markBookAsUnread(user_id, book_id);
    res.status(200).json({
      message: 'Livre marqué comme non lu',
      library: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour supprimer un livre de la bibliothèque
router.delete('/library/remove', async (req, res) => {
  const { user_id, book_id } = req.body;
  try {
    if (!user_id || !book_id) {
      return res.status(400).json({ error: 'user_id et book_id sont requis' });
    }

    const result = await removeBookFromLibrary(user_id, book_id);
    res.status(200).json({
      message: 'Livre supprimé de la bibliothèque',
      library: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour rechercher des livres
router.get('/search/books', async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) {
      return res.status(400).json({ error: 'La requête de recherche est requise' });
    }

    const books = await searchBooks(query);
    res.status(200).json({
      message: 'Livres trouvés',
      books,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour rechercher des utilisateurs
router.get('/search/users', async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) {
      return res.status(400).json({ error: 'La requête de recherche est requise' });
    }

    const users = await searchUsers(query);
    res.status(200).json({
      message: 'Utilisateurs trouvés',
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
