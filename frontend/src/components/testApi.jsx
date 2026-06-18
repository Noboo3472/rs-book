import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function TestApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/book/books/author/J.%20R.%20R.%20Tolkien') // ← Change selon ta route backend
      .then(res => setData(res.data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Test API</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur : {error}
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h3 className="font-bold">Réponse du backend :</h3>
          <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}