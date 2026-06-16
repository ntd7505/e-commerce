import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, logout as apiLogout } from "./authApi";
import { getAccessToken, getRefreshToken, clearAuthSession, isAuthenticated as checkIsAuthenticated, setUser as setStoredUser } from "./authStorage";
import type { User } from "./authTypes";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = checkIsAuthenticated();

    useEffect(() => {
        async function loadUser() {
            if (isAuthenticated) {
                try {
                    const userData = await getMe();
                    setUserState(userData);
                    setStoredUser(userData);
                } catch (error) {
                    console.error("Failed to load user:", error);
                    clearAuthSession();
                    setUserState(null);
                }
            } else {
                clearAuthSession();
                setUserState(null);
            }
            setIsLoading(false);
        }

        void loadUser();
    }, [isAuthenticated]);

    const setUser = (newUser: User | null) => {
        setUserState(newUser);
        if (newUser) {
            setStoredUser(newUser);
        }
    };

    const logout = async () => {
        try {
            const token = getRefreshToken() || getAccessToken();
            if (token) {
                await apiLogout(token);
            }
        } catch (error) {
            console.error("Failed to logout on server", error);
        } finally {
            clearAuthSession();
            setUserState(null);
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
