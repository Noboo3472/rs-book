import { useState } from 'react';
import { api } from '../api/client';

export function AddBookModal({ isOpen, onClose, user, onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    edited_by: '',
    published_date: '',
    synopsis: '',
    categories: '',
    genres: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'roman',
    'nouvelle',
    'poésie',
    'théâtre',
    'bande_dessinee',
    'roman_graphique',
    'manga',
    'biographie',
    'science_culture',
    'vie_pratique_loisirs',
    'scolaire',
  ];

  const genres = [
    'polar',
    'science_fiction',
    'fantasy',
    'horreur',
    'romance',
    'aventure',
    'historique',
    'comedie',
    'drame',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.title.trim() || !formData.author.trim()) {
        setError('Le titre et l\'auteur sont obligatoires');
        setIsLoading(false);
        return;
      }

      const res = await api.post('/api/library/add-new', {
        user_id: user.id,
        title: formData.title.trim(),
        author: formData.author.trim(),
        edited_by: formData.edited_by.trim(),
        published_date: formData.published_date,
        synopsis: formData.synopsis.trim(),
        categories: formData.categories || null,
        genres: formData.genres || null,
      });

      // Réinitialiser le formulaire
      setFormData({
        title: '',
        author: '',
        edited_by: '',
        published_date: '',
        synopsis: '',
        categories: '',
        genres: '',
      });

      // Appeler le callback parent
      if (onBookAdded) {
        onBookAdded(res.data.library);
      }

      // Fermer le modal
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout du livre');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Ajouter un nouveau livre</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-1 rounded transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Titre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Le Seigneur des Anneaux"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Auteur */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Auteur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Ex: J.R.R. Tolkien"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Éditeur */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Éditeur
            </label>
            <input
              type="text"
              name="edited_by"
              value={formData.edited_by}
              onChange={handleChange}
              placeholder="Ex: Éditions de Poche"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Date de publication */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date de publication
            </label>
            <input
              type="date"
              name="published_date"
              value={formData.published_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- Sélectionner une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Genre
            </label>
            <select
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- Sélectionner un genre --</option>
              {genres.map((gen) => (
                <option key={gen} value={gen}>
                  {gen.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Synopsis
            </label>
            <textarea
              name="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              placeholder="Décrivez le livre..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ajout en cours...' : '➕ Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
