import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/TopNav';

export function Feed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [publicationContent, setPublicationContent] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsByPublication, setCommentsByPublication] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchBooks();
      fetchFeed();
    }
  }, [user?.id]);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/book/books');
      const fetchedBooks = res.data.books || [];
      setBooks(fetchedBooks);
      if (!selectedBookId && fetchedBooks.length > 0) {
        setSelectedBookId(fetchedBooks[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des livres :', error);
    }
  };

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/feed/${user.id}`);
      const feedData = res.data.feed || [];
      setFeed(feedData);
      await loadCommentsForFeed(feedData);
    } catch (error) {
      console.error('Erreur lors du chargement du fil d\'actualité :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommentsForFeed = async (feedData) => {
    const commentsMap = {};
    await Promise.all(
      feedData.map(async (publication) => {
        try {
          const res = await api.get(`/comments/getComments/${publication.id}`);
          commentsMap[publication.id] = res.data || [];
        } catch (error) {
          console.error('Erreur lors du chargement des commentaires :', error);
          commentsMap[publication.id] = [];
        }
      })
    );
    setCommentsByPublication(commentsMap);
  };

  const fetchComments = async (publicationId) => {
    try {
      const res = await api.get(`/comments/getComments/${publicationId}`);
      setCommentsByPublication((prev) => ({
        ...prev,
        [publicationId]: res.data || [],
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires :', error);
    }
  };

  const handleCreatePublication = async (event) => {
    event.preventDefault();
    if (!user?.id) {
      setFormMessage('Vous devez être connecté pour publier.');
      return;
    }
    if (!selectedBookId) {
      setFormMessage('Sélectionnez un livre avant de publier.');
      return;
    }
    if (!publicationContent.trim()) {
      setFormMessage('Le contenu de la publication ne peut pas être vide.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/publications/publications', {
        userId: user.id,
        bookId: selectedBookId,
        content: publicationContent.trim(),
      });
      setPublicationContent('');
      setFormMessage('Votre publication a bien été ajoutée.');
      fetchFeed();
      setTimeout(() => setFormMessage(''), 4000);
    } catch (error) {
      console.error('Erreur lors de la création de la publication :', error);
      setFormMessage('Impossible de créer la publication. Réessayez plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitComment = async (publicationId) => {
    const content = (commentInputs[publicationId] || '').trim();
    if (!content) return;

    try {
      await api.post('/comments/comments', {
        publication_id: publicationId,
        user_id: user.id,
        content,
      });
      setCommentInputs((prev) => ({ ...prev, [publicationId]: '' }));
      fetchComments(publicationId);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire :', error);
      alert('Impossible d\'envoyer le commentaire. Réessayez.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav title="Fil d'actualité" />

      <main className="container mx-auto mt-6 p-4">
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                Chargement du fil...
              </div>
            ) : feed.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">Aucune publication trouvée. Suivez des utilisateurs pour voir leurs mises à jour.</p>
              </div>
            ) : (
              <div className="space-y-4">
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
                    <p className="text-gray-700 mb-4">{publication.content}</p>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Commentaires</h4>
                        {(commentsByPublication[publication.id] || []).length === 0 ? (
                          <p className="text-sm text-gray-500">Aucun commentaire pour l'instant.</p>
                        ) : (
                          <div className="space-y-3">
                            {(commentsByPublication[publication.id] || []).map((comment) => (
                              <div key={comment.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                                <p className="text-sm text-gray-600">@{comment.user.user_name || 'nouvel utilisateur'}</p>
                                <p className="text-sm text-gray-500 mb-1">{new Date(comment.comment_date).toLocaleString('fr-FR')}</p>
                                <p className="text-gray-700">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <textarea
                          value={commentInputs[publication.id] || ''}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [publication.id]: e.target.value }))}
                          rows={3}
                          placeholder="Ajouter un commentaire..."
                          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSubmitComment(publication.id)}
                          className="mt-3 inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                        >
                          Publier le commentaire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Ajouter un avis</h2>
              <form onSubmit={handleCreatePublication} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Livre</label>
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {books.length === 0 ? (
                      <option value="">Aucun livre disponible</option>
                    ) : (
                      books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title} - {book.author}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Votre publication</label>
                  <textarea
                    value={publicationContent}
                    onChange={(e) => setPublicationContent(e.target.value)}
                    rows={5}
                    placeholder="Racontez ce que vous avez pensé du livre..."
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {formMessage && (
                  <div className="rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    {formMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {isSubmitting ? 'Publication en cours...' : 'Publier ma publication'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Conseil</h3>
              <p className="text-gray-600 text-sm">
                Choisissez un livre, partagez votre avis et laissez la communauté commenter votre publication.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
