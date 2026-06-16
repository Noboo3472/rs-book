//Les fonctions de management des livres
import prisma from '../db.js';

//Fonction pour créer un livre
export const createBook = async (title, author, edited_by, published_date,synopsis, categories, genres) => {
    try {
        const newBook = await prisma.books.create({
            data: {
                title,
                author,
                edited_by,
                published_date: new Date(published_date),
                synopsis,
                categories,
                genres
            }
        });
        return newBook;
    } catch (error) {
        console.error('Erreur lors de la création du livre =>', error);
        throw new Error('Erreur lors de la création du livre');
    }
};

//Fonction pour récupérer tous les livres
export const getAllBooks = async () => {
    try {
        const books = await prisma.books.findMany();
        return books;
    } catch (error) {
        console.error('Erreur lors de la récupération des livres =>', error);
        throw new Error('Erreur lors de la récupération des livres');
    }
};

//Fonction pour récupérer un livre par son titre
export const getBookByTitle = async (title) => {
    try {
        const book = await prisma.books.findMany({
            where: { title }
        });
        return book;
    } catch (error) {
        console.error('Erreur lors de la récupération du livre par titre =>', error);
        throw new Error('Erreur lors de la récupération du livre par titre');
    }
};

//Fonction pour récupérer des livres par son auteur
export const getBooksByAuthor = async (author) => {
    try {
        const books = await prisma.books.findMany({
            where: { author }
        });
        return books;
    } catch (error) {
        console.error('Erreur lors de la récupération des livres par auteur =>', error);
        throw new Error('Erreur lors de la récupération des livres par auteur');
    }
};

//Fonction pour récupérer des livres par son éditeur
export const getBooksByEditor = async (edited_by) => {
    try {
        const books = await prisma.books.findMany({
            where: { edited_by }
        });
        return books;
    } catch (error) {
        console.error('Erreur lors de la récupération des livres par éditeur =>', error);
        throw new Error('Erreur lors de la récupération des livres par éditeur');
    }
};

//Fonction pour récupérer des livres par catégorie
export const getBooksByCategory = async (categories) => {
    try {
        const books = await prisma.books.findMany({
            where: { categories }
        });
        return books;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des livres par catégorie =>', error);
        throw new Error('Erreur lors de la récupération des livres par catégorie');
    }
};

//Fonction pour récupérer des livres par genre
export const getBooksByGenre = async (genres) => {
    try {
        const books = await prisma.books.findMany({
            where: { genres }
        });
        return books;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des livres par genre =>', error);
        throw new Error('Erreur lors de la récupération des livres par genre');
    }
};

