import { useContext } from "react";
import { useState, createContext } from "react";

const BASE_URL = `http://localhost:9000/users`;
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}?email=${email}`);
      const [foundUser] = await res.json();

      if (foundUser && foundUser.password === password) {
        setCurrentUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(foundUser));

        return foundUser;
      }
      throw new Error("Invalid credentials");
    } catch (e) {
      throw e;
    }
  }

  function logout() {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{ login, logout, currentUser, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AUth context is use out of it is provider");
  return context;
}

export { AuthProvider, useAuth };
