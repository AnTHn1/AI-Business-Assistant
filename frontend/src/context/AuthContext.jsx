import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('DEBUG - Token al cargar:', token ? 'Existe' : 'No existe');
    if (token) {
      authAPI.getMe()
        .then(res => {
          console.log('DEBUG - /auth/me success:', res.data);
          setUser(res.data);
        })
        .catch(err => {
          console.log('DEBUG - /auth/me error:', err.response?.status, err.response?.data);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log('DEBUG - Intentando login con:', email);
    const response = await authAPI.login(email, password);
    console.log('DEBUG - Login response:', response.data);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    console.log('DEBUG - Token guardado en localStorage');
    
    const meResponse = await authAPI.getMe();
    console.log('DEBUG - /auth/me después de login:', meResponse.data);
    setUser(meResponse.data);
    return meResponse.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);