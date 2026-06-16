import express from "express";
import {createBook,getAllBooks,getBookByTitle,getBooksByAuthor, getBooksByEditor,getBooksByCategory,getBooksByGenre} from '../services/bookServices.js';

const router = express.Router();

// Route pour créer un livre
router.post('/books', async (req, res) => {
    const { title, author, edited_by, published_date, synopsis, categories, genres } = req.body;
    try {
        const newBook = await createBook(title, author, edited_by, published_date, synopsis, categories, genres);
        res.status(201).json({ message: "Livre créé avec succès", book: newBook });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer tous les livres
router.get('/books', async (req, res) => {
    try {
        const books = await getAllBooks();
        res.status(200).json({ message: "Livres récupérés avec succès", books });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer un livre par son titre
router.get('/books/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const book = await getBookByTitle(title);
        if (!book) {
            return res.status(404).json({ error: "Livre non trouvé" });
        }
        res.status(200).json({ message: "Livre récupéré avec succès", book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer des livres par son auteur
router.get('/books/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const books = await getBooksByAuthor(author);
        res.status(200).json({ message: "Livres récupérés avec succès", books });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer des livres par son éditeur
router.get('/books/editor/:edited_by', async (req, res) => {
    const { edited_by } = req.params;
    try {
        const books = await getBooksByEditor(edited_by);
        res.status(200).json({ message: "Livres récupérés avec succès", books });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer des livres par sa catégorie
router.get('/books/category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const books = await getBooksByCategory(category);
        res.status(200).json({ message: "Livres récupérés avec succès", books });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour récupérer des livres par son genre
router.get('/books/genre/:genre', async (req, res) => {
    const { genre } = req.params;
    try {
        const books = await getBooksByGenre(genre);
        res.status(200).json({ message: "Livres récupérés avec succès", books });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
