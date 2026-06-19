import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { SearchBar } from './SearchBar';

export function TopNav({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/feed')}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition font-semibold"
            >
              Fil d'actualité
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition font-semibold"
            >
              Découvrir
            </button>
            <button
              onClick={() => navigate('/library')}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition font-semibold"
            >
              Ma Bibliothèque
            </button>
            {user?.id && (
              <button
                onClick={() => navigate(`/profile/${user.id}`)}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition font-semibold"
              >
                Mon profil
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
