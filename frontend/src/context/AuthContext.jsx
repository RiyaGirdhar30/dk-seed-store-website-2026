import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("dkUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("dkToken") || null;
  });

  useEffect(() => {
  const fetchCurrentUser = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.message ||
            "Unable to fetch current user"
        );

        return;
      }

      setUser(data.user);

      localStorage.setItem(
        "dkUser",
        JSON.stringify(data.user)
      );
    } catch (error) {
      console.error(
        "Auth user fetch error:",
        error
      );
    }
  };

  fetchCurrentUser();
}, [token]);

 const login = (userData, userToken) => {
  const normalizedUser = {
    ...userData,
    id: userData.id || userData._id,
  };

  localStorage.setItem(
    "dkUser",
    JSON.stringify(normalizedUser)
  );

  localStorage.setItem(
    "dkToken",
    userToken
  );

  setUser(normalizedUser);
  setToken(userToken);
};

  const logout = () => {
    localStorage.removeItem("dkUser");
    localStorage.removeItem("dkToken");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoggedIn: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}