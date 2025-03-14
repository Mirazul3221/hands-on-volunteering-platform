import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token,setToken] = useState(null)
  useEffect(() => {
    const tokenId = localStorage.getItem("token");
    setToken(tokenId)
    if (tokenId) {
      axios
        .get("https://handson-backend-sigma.vercel.app/api/auth/user", {
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
    const res = await axios.post("https://handson-backend-sigma.vercel.app/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
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
