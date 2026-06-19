import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mon Projet Full-Stack</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="container mx-auto mt-6 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            Bienvenue, {user?.name} ! 🎉
          </h2>
          <p className="text-gray-600 mb-4">Email : {user?.email}</p>
          <p className="text-lg">Tu es maintenant connecté ✅</p>
        </div>
      </main>
    </div>
  );
}