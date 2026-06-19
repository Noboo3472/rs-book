import prisma from '../db.js';

export const getFeedForUser = async (userId) => {
  try {
    const followings = await prisma.follow.findMany({
      where: { follower_id: userId },
      select: { following_id: true },
    });

    const followingIds = followings.map((follow) => follow.following_id);
    if (followingIds.length === 0) {
      return [];
    }

    const feed = await prisma.publications.findMany({
      where: { user_id: { in: followingIds } },
      orderBy: { publication_date: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            user_name: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            edited_by: true,
          },
        },
      },
    });

    return feed;
  } catch (error) {
    console.error('Erreur lors de la récupération du fil d\'actualité =>', error);
    throw new Error('Erreur lors de la récupération du fil d\'actualité');
  }
};
