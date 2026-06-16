//Controller pour les follow
import { followUser, unfollowUser, getFollowers, getFollowings } from '../services/followServices.js';

//Controller pour suivre un utilisateur
export const followUserController = async (req, res) => {
    const { followerId, followingId } = req.body;
    try {
        const follow = await followUser(followerId, followingId);
        res.status(201).json(follow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Controller pour unfollow un utilisateur
export const unfollowUserController = async (req, res) => {
    const { followerId, followingId } = req.body;
    try {
        const unfollow = await unfollowUser(followerId, followingId);
        res.status(200).json(unfollow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Controller pour récupérer les followers d'un utilisateur
export const getFollowersController = async (req, res) => {
    const { userId } = req.params;
    try {
        const followers = await getFollowers(userId);
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Controller pour récupérer les followings d'un utilisateur
export const getFollowingsController = async (req, res) => {
    const { userId } = req.params;
    try {
        const followings = await getFollowings(userId);
        res.status(200).json(followings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

