import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { SearchBar } from '../components/SearchBar';
import { TopNav } from '../components/TopNav';
import { useState, useEffect } from 'react';
import { api } from '../api/client';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/book/books');
      setBooks(res.data.books || []);
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBookToLibrary = async (book_id) => {
    try {
      const res = await api.post('/api/library/add', {
        user_id: user.id,
        book_id,
      });
      setSuccessMessage(`📚 "${res.data.library.book.title}" ajouté à votre bibliothèque !`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'ajout');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav title="Mon Projet Full-Stack" />
      <main className="container mx-auto mt-6 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Bienvenue, {user?.name} ! 🎉
          </h2>
          <p className="text-gray-600 mb-2">Email : {user?.email}</p>
          <p className="text-lg text-green-600">Tu es maintenant connecté ✅</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Books Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">📖 Livres disponibles</h3>

          {isLoading ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">Chargement des livres...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">Aucun livre disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h4 className="font-bold text-lg text-gray-800 mb-2">
                    {book.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Auteur :</strong> {book.author}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Éditeur :</strong> {book.edited_by}
                  </p>
                  {book.categories && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Catégorie :</strong> {book.categories}
                    </p>
                  )}
                  {book.genres && (
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Genre :</strong> {book.genres}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {book.synopsis}
                  </p>
                  <button
                    onClick={() => addBookToLibrary(book.id)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
                  >
                    ➕ Ajouter à ma bibliothèque
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}