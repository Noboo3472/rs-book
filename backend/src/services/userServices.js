import prisma from '../db.js';

export const getUserById = async (userId) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        user_name: true,
        created_at: true,
      },
    });

    if (!user) return null;

    const followerCount = await prisma.follow.count({
      where: { following_id: userId },
    });
    const followingCount = await prisma.follow.count({
      where: { follower_id: userId },
    });

    return {
      ...user,
      followerCount,
      followingCount,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur =>', error);
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
};
