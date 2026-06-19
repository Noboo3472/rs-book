import prisma from '../db.js';

export const getBookWithReviews = async (bookId) => {
  try {
    const book = await prisma.books.findUnique({
      where: { id: bookId },
      include: {
        opinions: {
          include: {
            user: {
              select: {
                id: true,
                user_name: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!book) return null;

    const average = await prisma.opinions.aggregate({
      _avg: { rating: true },
      where: { book_id: bookId },
    });

    return {
      ...book,
      avgRating: average._avg.rating ? Number(average._avg.rating.toFixed(1)) : null,
      reviews: book.opinions,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du livre avec avis =>', error);
    throw new Error('Erreur lors de la récupération du livre avec avis');
  }
};

export const createOpinionAndPublication = async (userId, bookId, rating, comment) => {
  try {
    const opinion = await prisma.opinions.create({
      data: {
        user_id: userId,
        book_id: bookId,
        rating,
        comment,
        created_at: new Date(),
      },
    });

    const publicationContent = comment
      ? `Nouvel avis sur ce livre : ${comment}`
      : 'Nouvel avis publié.';

    const publication = await prisma.publications.create({
      data: {
        user_id: userId,
        book_id: bookId,
        content: publicationContent,
        publication_date: new Date(),
      },
    });

    return { opinion, publication };
  } catch (error) {
    console.error('Erreur lors de la création de l\'avis et de la publication =>', error);
    throw new Error('Erreur lors de la création de l\'avis');
  }
};

export const getReviewsByUser = async (userId) => {
  try {
    const reviews = await prisma.opinions.findMany({
      where: { user_id: userId },
      include: {
        book: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return reviews;
  } catch (error) {
    console.error('Erreur lors de la récupération des avis de l\'utilisateur =>', error);
    throw new Error('Erreur lors de la récupération des avis de l\'utilisateur');
  }
};
