import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Dashboard } from './pages/dashboard';
import { Library } from './pages/library';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile';
import { BookDetail } from './pages/BookDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/books/:bookId" element={<BookDetail />} />
          <Route path="/" element={<Navigate to="/feed" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;