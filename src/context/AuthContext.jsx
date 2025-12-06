import { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo, loginUser } from "../api/api";


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);


function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


const login = async (credentials) => {
  try {
    const res = await loginUser(credentials);
      localStorage.setItem("token", res.data.access);
      await fetchUser();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };


const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
};


const fetchUser = async () => {
  try {
    const res = await getUserInfo();
    setUser(res.data.user || res.data);
    } catch (err) {
    console.warn("User fetch failed:", err);
    setUser(null);
  }
};


useEffect(() => {
const token = localStorage.getItem("token");
  const init = async () => {
      if (token) await fetchUser();
      setLoading(false);
    };
    init();
  }, []);


return (
<AuthContext.Provider value={{ user, loading, login, logout }}>
  {children}
</AuthContext.Provider>
);}


export default AuthProvider;