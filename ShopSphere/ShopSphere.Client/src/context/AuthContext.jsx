import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api/api";

const TOKEN_KEY = "shopsphere-token";
const USER_KEY = "shopsphere-user";

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    roles: Array.isArray(user.roles)
      ? user.roles
      : Array.isArray(user.Roles)
        ? user.Roles
        : [],
  };
}

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? normalizeUser(JSON.parse(storedUser)) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const saveAuth = (authResponse) => {
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authResponse.user)
    );

    const normalizedUser = normalizeUser(authResponse.user);
    setUser(normalizedUser);

    return normalizedUser;
  };

  useEffect(() => {
    const verifyCurrentUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const normalizedUser = normalizeUser(response.data);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(normalizedUser)
        );

        setUser(normalizedUser);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    verifyCurrentUser();

    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  const login = async (credentials) => {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    const user = saveAuth(response.data);

    return user;
  };

  const register = async (formData) => {
    const response = await api.post(
      "/auth/register",
      formData
    );

    return saveAuth(response.data);
  };

  const logout = () => {
    clearAuth();
  };

  const hasRole = (role) =>
    Boolean(
      user?.roles?.some(
        (userRole) =>
          userRole.toLowerCase() === role.toLowerCase()
      )
    );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      hasRole,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
