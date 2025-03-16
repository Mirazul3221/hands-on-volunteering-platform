import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token,setToken] = useState(null)
  useEffect(() => {
    const tokenId = localStorage.getItem("token");
    setToken(tokenId)
    if (tokenId) {
      axios
        .get(`${apiUrl}/api/auth/user`, {
          headers: { Authorization: `Bearer ${tokenId}` },
        })
        .then((res) => {
            setUser(res.data.user)
        })
        .catch(() => {
            localStorage.removeItem("token")
        });
    } else {
        // navigate('/')
    }

  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (error) {
      
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
