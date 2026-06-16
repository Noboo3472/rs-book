//Ici je regroupe les fonction qui permettent de follow, d'unfollow, de récupérer les followers et les followings d'un utilisateur
import prisma from '../db.js';

//Fonction pour suivre un utilisateur
export const followUser = async (followerId, followingId) => {
    try {
        const follow = await prisma.follow.create({
            data: {
                follower_id: followerId,
                following_id: followingId,
                follow_date: new Date()
            }
        });
        return follow;
    } catch (error) {
        console.error('Erreur lors du follow =>', error);
        throw new Error('Erreur lors du follow');
    }
};

//Fonction pour unfollow un utilisateur
export const unfollowUser = async (followerId, followingId) => {
    try {
        const unfollow = await prisma.follow.delete({
            where: {
                follower_id_following_id: {
                    follower_id: followerId,
                    following_id: followingId
                }
            }
        });
        return unfollow;
    } catch (error) {
        console.error('Erreur lors du unfollow =>', error);
        throw new Error('Erreur lors du unfollow');
    }
};

//Fonction pour récupérer les followers d'un utilisateur
export const getFollowers = async (userId) => {
    try {
        const followers = await prisma.follow.findMany({
            where: { following_id: userId },
            include: { follower: true }
        });
        return followers.map(follow => follow.follower);
    } catch (error) {
        console.error('Erreur lors de la récupération des followers =>', error);
        throw new Error('Erreur lors de la récupération des followers');
    }
};

//Fonction pour récupérer les followings d'un utilisateur
export const getFollowings = async (userId) => {
    try {
        const followings = await prisma.follow.findMany({
            where: { follower_id: userId },
            include: { following: true }
        });
        return followings.map(follow => follow.following);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des followings =>', error);
        throw new Error('Erreur lors de la récupération des followings');
    }
};
