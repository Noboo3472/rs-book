import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { api } from '../api/client';
import { TopNav } from '../components/TopNav';

export function BookDetail() {
  const { bookId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBookDetail();
  }, [bookId]);

  const fetchBookDetail = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/opinions/books/id/${bookId}`);
      setBook(res.data.book);
    } catch (error) {
      console.error('Erreur lors du chargement du livre :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!user?.id || !bookId) return;

    try {
      await api.post('/opinions', {
        userId: user.id,
        bookId,
        rating: Number(rating),
        comment,
      });
      setSuccessMessage('Merci ! Votre avis a été publié.');
      setComment('');
      setRating(5);
      fetchBookDetail();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'avis :', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'envoi de l\'avis.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav title="Détail du livre" />

      <main className="container mx-auto mt-6 p-4">
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            Chargement du livre...
          </div>
        ) : !book ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Livre introuvable.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">{book.author} • {book.edited_by}</p>
              <p className="text-gray-500 mb-2">Catégorie : {book.categories || 'N/A'}</p>
              <p className="text-gray-500 mb-2">Genre : {book.genres || 'N/A'}</p>
              {book.avgRating !== null ? (
                <p className="text-lg font-semibold text-green-700">Note moyenne : {book.avgRating} / 5</p>
              ) : (
                <p className="text-lg font-semibold text-gray-700">Pas encore de note</p>
              )}
              <p className="text-gray-700 mt-4">{book.synopsis}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Publier un avis</h3>
              {successMessage && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
                  {successMessage}
                </div>
              )}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Note</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[5, 4, 3, 2, 1].map((note) => (
                      <option key={note} value={note}>
                        {note} / 5
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Commentaire</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                >
                  Publier mon avis
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Avis des lecteurs</h3>
              {book.reviews.length === 0 ? (
                <p className="text-gray-600">Aucun avis pour l'instant.</p>
              ) : (
                <div className="space-y-4">
                  {book.reviews.map((review) => (
                    <div key={review.id} className="border p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">@{review.user.user_name}</p>
                        <p className="text-sm text-gray-500">{review.rating} / 5</p>
                      </div>
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
