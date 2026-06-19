import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { api } from '../api/client';
import { TopNav } from '../components/TopNav';

export function Profile() {
  const { user: currentUser, logout } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
    checkFollowing();
  }, [userId, currentUser.id]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/users/${userId}`);
      setProfile(res.data.user);
      const reviewsRes = await api.get(`/users/${userId}/reviews`);
      setReviews(reviewsRes.data.reviews || []);
    } catch (error) {
      console.error('Erreur lors du chargement du profil :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFollowing = async () => {
    if (!currentUser?.id) return;

    try {
      const res = await api.get(`/follow/followings/${currentUser.id}`);
      const followings = res.data || [];
      setIsFollowing(followings.some((u) => String(u.id) === String(userId)));
    } catch (error) {
      console.error('Erreur lors de la vérification du suivi :', error);
    }
  };

  const handleFollow = async () => {
    try {
      await api.post('/follow/follow', {
        followerId: currentUser.id,
        followingId: userId,
      });
      setIsFollowing(true);
      fetchProfile();
    } catch (error) {
      console.error('Erreur lors du suivi :', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.post('/follow/unfollow', {
        followerId: currentUser.id,
        followingId: userId,
      });
      setIsFollowing(false);
      fetchProfile();
    } catch (error) {
      console.error('Erreur lors du désabonnement :', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav title="Profil utilisateur" />

      <main className="container mx-auto mt-6 p-4">
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            Chargement du profil...
          </div>
        ) : !profile ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Profil introuvable.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">@{profile.user_name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
                {currentUser.id !== userId && (
                  <div>
                    {isFollowing ? (
                      <button
                        onClick={handleUnfollow}
                        className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                      >
                        Se désabonner
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                      >
                        Suivre
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">Membres depuis le {new Date(profile.created_at).toLocaleDateString('fr-FR')}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Abonnés</p>
                  <p className="text-xl font-bold">{profile.followerCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Abonnements</p>
                  <p className="text-xl font-bold">{profile.followingCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Avis récents</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-600">Aucun avis publié par cet utilisateur.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">{new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
                      <h4 className="font-semibold text-lg">{review.book.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">Note : {review.rating} / 5</p>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
