import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext'; // Ajusta la ruta
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import SharedProfile from './pages/SharedProfile';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuthStore } from './store/auth/userAuthStore';
import { pageview } from './utils/analytics';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user, profile, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    if (!user && !isLoading) {
      checkAuth(); // Verifica el estado de autenticación al montar
    }
  }, []);

  
  useEffect(() => {
    pageview(location.pathname);
  }, [location]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && profile?.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Componente para rutas públicas que redirigen si ya estás autenticado
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (user) {
    return <Navigate to={`/profile/${user.uid}`} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <ProfileProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/perfil/:username" element={<SharedProfile />} />

              {/* Rutas protegidas */}
              <Route
                path="/profile/:id"
                element={<ProtectedRoute><Profile /></ProtectedRoute>}
              />
              <Route
                path="/admin"
                element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>}
              />

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ProfileProvider>
    </Router>
  );
}

export default App;