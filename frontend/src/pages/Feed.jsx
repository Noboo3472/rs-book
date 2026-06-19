import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/TopNav';

export function Feed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchFeed();
    }
  }, [user?.id]);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/feed/${user.id}`);
      setFeed(res.data.feed || []);
    } catch (error) {
      console.error('Erreur lors du chargement du fil d\'actualité :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav title="Fil d'actualité" />

      <main className="container mx-auto mt-6 p-4">
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            Chargement du fil...
          </div>
        ) : feed.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Aucune publication trouvée. Suivez des utilisateurs pour voir leurs mises à jour.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {feed.map((publication) => (
              <div key={publication.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Par @{publication.user.user_name}</p>
                    <p className="text-sm text-gray-500">{new Date(publication.publication_date).toLocaleString('fr-FR')}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/profile/${publication.user.id}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Voir le profil
                  </button>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{publication.book.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{publication.book.author} • {publication.book.edited_by}</p>
                <p className="text-gray-700">{publication.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
