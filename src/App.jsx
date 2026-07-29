import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import HomePage from './pages/HomePage';
import BookReaderPage from './pages/BookReaderPage';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('digibook_auth') === 'true';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search', handleOpenSearch);
    return () => window.removeEventListener('open-search', handleOpenSearch);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('digibook_auth');
    localStorage.removeItem('digibook_user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} onLogout={handleLogout} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenSearch={() => setIsSearchOpen(true)} />} />
            <Route path="/book/:bookId" element={<BookReaderPage />} />
            <Route path="/book/:bookId/:chapterId" element={<BookReaderPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Routes>
        </main>

        <Footer />

        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </Router>
  );
}
