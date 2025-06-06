import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={user ? <Navigate to="/weather" /> : <Navigate to="/login" />} />
        <Route path="login" element={!user ? <Login /> : <Navigate to="/weather" />} />
        <Route path="register" element={!user ? <Register /> : <Navigate to="/weather" />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="weather" element={<Weather />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;