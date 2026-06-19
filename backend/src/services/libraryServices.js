import prisma from '../db.js';

// Ajouter un livre à la bibliothèque
export const addBookToLibrary = async (user_id, book_id) => {
  try {
    const existingEntry = await prisma.library.findUnique({
      where: {
        user_id_book_id: {
          user_id,
          book_id,
        },
      },
    });

    if (existingEntry) {
      throw new Error('Ce livre est déjà dans votre bibliothèque');
    }

    const libraryEntry = await prisma.library.create({
      data: {
        user_id,
        book_id,
        is_read: false,
      },
      include: {
        book: true,
      },
    });

    return libraryEntry;
  } catch (error) {
    throw error;
  }
};

// Récupérer tous les livres de la bibliothèque d'un utilisateur
export const getUserLibrary = async (user_id) => {
  try {
    const library = await prisma.library.findMany({
      where: {
        user_id,
      },
      include: {
        book: true,
      },
      orderBy: {
        added_at: 'desc',
      },
    });

    return library;
  } catch (error) {
    throw error;
  }
};

// Marquer un livre comme lu
export const markBookAsRead = async (user_id, book_id) => {
  try {
    const libraryEntry = await prisma.library.update({
      where: {
        user_id_book_id: {
          user_id,
          book_id,
        },
      },
      data: {
        is_read: true,
      },
      include: {
        book: true,
      },
    });

    return libraryEntry;
  } catch (error) {
    throw error;
  }
};

// Marquer un livre comme non lu
export const markBookAsUnread = async (user_id, book_id) => {
  try {
    const libraryEntry = await prisma.library.update({
      where: {
        user_id_book_id: {
          user_id,
          book_id,
        },
      },
      data: {
        is_read: false,
      },
      include: {
        book: true,
      },
    });

    return libraryEntry;
  } catch (error) {
    throw error;
  }
};

// Supprimer un livre de la bibliothèque
export const removeBookFromLibrary = async (user_id, book_id) => {
  try {
    const libraryEntry = await prisma.library.delete({
      where: {
        user_id_book_id: {
          user_id,
          book_id,
        },
      },
    });

    return libraryEntry;
  } catch (error) {
    throw error;
  }
};

// Rechercher des livres par titre
export const searchBooks = async (query) => {
  try {
    const books = await prisma.books.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            author: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 20,
    });

    return books;
  } catch (error) {
    throw error;
  }
};

// Rechercher des utilisateurs par nom
export const searchUsers = async (query) => {
  try {
    const users = await prisma.users.findMany({
      where: {
        user_name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        user_name: true,
        email: true,
      },
      take: 20,
    });

    return users;
  } catch (error) {
    throw error;
  }
};
