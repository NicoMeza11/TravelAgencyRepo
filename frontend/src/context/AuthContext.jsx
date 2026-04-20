import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ keycloak, children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(keycloak.authenticated);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (keycloak.authenticated) {
            setIsAuthenticated(true);
            setUser({
                username: keycloak.tokenParsed?.preferred_username,
                email: keycloak.tokenParsed?.email,
                firstName: keycloak.tokenParsed?.given_name,
                lastName: keycloak.tokenParsed?.family_name,
                roles: keycloak.tokenParsed?.realm_access?.roles ?? [],
            });
        }

        const interval = setInterval(() => {
            keycloak.updateToken(60).catch(() => {
                keycloak.logout();
            });
        }, 60000);

        return () => clearInterval(interval);
    }, [keycloak]);

    const login = () => keycloak.login();
    const logout = () => keycloak.logout({ redirectUri: window.location.origin });

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, keycloak }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);