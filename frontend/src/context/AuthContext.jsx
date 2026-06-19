import { createContext, useState } from 'react';
import { api } from '../api/client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Fonction login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  // Fonction register
  const register = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  // Fonction logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Charger l'user au démarrage (de localStorage)
  const loadUser = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}