import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.username === username);

    if (exists) {
      return { success: false, message: "Username already exists" };
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true };
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    }

    return { success: false, message: "Invalid username or password" };
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
