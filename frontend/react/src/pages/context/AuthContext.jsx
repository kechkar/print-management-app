import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Récupérer l'utilisateur depuis localStorage ou l'état de navigation
    const storedUser = localStorage.getItem('userData');
    const locationUser = location.state?.user;

    if (locationUser) {
      setUser(locationUser);
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const value = {
    user,
    setUser,
    login: (userData) => {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    },
    logout: () => {
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
      setUser(null);
      navigate('/loginAdmin');
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);