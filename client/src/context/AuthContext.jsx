// This context keeps track of "who is logged in" for the whole app,
// so any component can read it with useAuth() instead of passing
// props down through every page.

import { createContext, useContext, useState } from "react";
import { loginRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Load whatever was saved from the last visit (so refreshing the
    // page doesn't log the user out)
    const [token, setToken] = useState(() => localStorage.getItem("reclaimToken"));
    const [user, setUser] = useState(() => {
        let saved = localStorage.getItem("reclaimUser");
        return saved ? JSON.parse(saved) : null;
    });

    function saveSession(newToken, newUser) {
        localStorage.setItem("reclaimToken", newToken);
        localStorage.setItem("reclaimUser", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }

    // Used by the Login page
    async function login(email, password, role) {
        let data = await loginRequest({ email, password, role });
        saveSession(data.token, data.user);
        return data.user;
    }

    // Used by the Register page, after it already called the register API itself
    function loginWithSession(newToken, newUser) {
        saveSession(newToken, newUser);
    }

    function logout() {
        localStorage.removeItem("reclaimToken");
        localStorage.removeItem("reclaimUser");
        setToken(null);
        setUser(null);
    }

    const value = {
        token,
        user,
        isLoggedIn: !!token,
        login,
        loginWithSession,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Small helper hook so components just write: const { user, logout } = useAuth();
export function useAuth() {
    return useContext(AuthContext);
}
