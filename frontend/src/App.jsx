import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? (
        <ErrorBoundary>
          <ChatPage />
        </ErrorBoundary>
      ) : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
    </Routes>
  );
}

export default App;
