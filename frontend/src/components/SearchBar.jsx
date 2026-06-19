import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ books: [], users: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ books: [], users: [] });
      setShowResults(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [booksRes, usersRes] = await Promise.all([
          api.get(`/api/search/books?query=${encodeURIComponent(query)}`),
          api.get(`/api/search/users?query=${encodeURIComponent(query)}`),
        ]);

        setResults({
          books: booksRes.data.books || [],
          users: usersRes.data.users || [],
        });
        setShowResults(true);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setResults({ books: [], users: [] });
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = (path) => {
    setShowResults(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="relative w-full md:w-96">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setShowResults(true)}
        placeholder="Rechercher un livre ou un utilisateur..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showResults && (query.length > 0 || results.books.length > 0 || results.users.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-gray-500">Recherche en cours...</div>
          )}

          {!isLoading && results.books.length === 0 && results.users.length === 0 && (
            <div className="p-4 text-gray-500">Aucun résultat trouvé</div>
          )}

          {results.books.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-100 font-semibold text-sm">
                📚 Livres
              </div>
              {results.books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleResultClick(`/books/${book.id}`)}
                  className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  <h4 className="font-semibold text-gray-600">{book.title}</h4>
                  <p className="text-xs text-gray-600">{book.author}</p>
                </div>
              ))}
            </>
          )}

          {results.users.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-100 font-semibold text-sm">
                👤 Utilisateurs
              </div>
              {results.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleResultClick(`/profile/${user.id}`)}
                  className="px-4 py-3 border-b hover:bg-blue-50 cursor-pointer transition"
                >
                  <h4 className="font-semibold text-base text-gray-900">@{user.user_name}</h4>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
