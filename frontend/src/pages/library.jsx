import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/TopNav';

export function Library() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, read, unread

  useEffect(() => {
    fetchLibrary();
  }, [user?.id]);

  const fetchLibrary = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.get(`/api/library/${user.id}`);
      setLibrary(res.data.library || []);
    } catch (error) {
      console.error('Erreur lors du chargement de la bibliothèque:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookReadStatus = async (bookId, isCurrentlyRead) => {
    try {
      const endpoint = isCurrentlyRead ? '/api/library/mark-unread' : '/api/library/mark-read';
      const res = await api.put(endpoint, {
        user_id: user.id,
        book_id: bookId,
      });

      // Mettre à jour l'état local
      setLibrary(
        library.map((entry) =>
          entry.book_id === bookId
            ? { ...entry, is_read: !isCurrentlyRead }
            : entry
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const removeBookFromLibrary = async (bookId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre de votre bibliothèque ?')) {
      try {
        await api.delete('/api/library/remove', {
          data: {
            user_id: user.id,
            book_id: bookId,
          },
        });

        setLibrary(library.filter((entry) => entry.book_id !== bookId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredLibrary = library.filter((entry) => {
    if (filter === 'read') return entry.is_read;
    if (filter === 'unread') return !entry.is_read;
    return true;
  });

  const readCount = library.filter((e) => e.is_read).length;
  const unreadCount = library.filter((e) => !e.is_read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav title="Ma Bibliothèque" />

      {/* Main Content */}
      <main className="container mx-auto mt-6 p-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-gray-600 text-sm font-semibold">Total</h3>
            <p className="text-3xl font-bold text-blue-600">{library.length}</p>
            <p className="text-gray-500 text-xs">livres</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-gray-600 text-sm font-semibold">Lus</h3>
            <p className="text-3xl font-bold text-green-600">{readCount}</p>
            <p className="text-gray-500 text-xs">livres lus</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-gray-600 text-sm font-semibold">À lire</h3>
            <p className="text-3xl font-bold text-yellow-600">{unreadCount}</p>
            <p className="text-gray-500 text-xs">livres à lire</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded transition ${
              filter === 'read'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lus ✓
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded transition ${
              filter === 'unread'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            À lire 📖
          </button>
        </div>

        {/* Books List */}
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Chargement de votre bibliothèque...</p>
          </div>
        ) : filteredLibrary.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">
              {library.length === 0
                ? '📚 Votre bibliothèque est vide. Ajoutez vos premiers livres !'
                : 'Aucun livre ne correspond à votre filtre.'}
            </p>
            {library.length === 0 && (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Parcourir les livres
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLibrary.map((entry) => (
              <div
                key={entry.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {entry.book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      par {entry.book.author}
                    </p>
                  </div>
                  {entry.is_read && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      ✓ Lu
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {entry.book.synopsis}
                </p>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleBookReadStatus(entry.book_id, entry.is_read)}
                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition ${
                      entry.is_read
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    {entry.is_read ? '✓ Marqué comme lu' : '📖 Marquer comme lu'}
                  </button>
                  <button
                    onClick={() => removeBookFromLibrary(entry.book_id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-semibold hover:bg-red-200 transition"
                  >
                    Supprimer
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Ajouté le {new Date(entry.added_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
