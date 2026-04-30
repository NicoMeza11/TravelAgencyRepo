import { Routes, Route, Navigate, redirect } from 'react-router-dom';
import keycloak from './keycloak';
import ProtectedRoute from './components/ProtectedRoute'; 
import LoginPage from './pages/LoginPage';
import HomeMenu from './components/HomeMenu';
import AdminHomeMenu from './components/AdminHomeMenu';
import { useEffect, useRef } from 'react';
import api from './ApiConf';
import ListPackages from './pages/ListPackages';


const DashboardAdmin = () => <div><h1>Panel de Administración</h1><p>Gestión de reservas y paquetes.</p></div>;
const NoAutorizado = () => <div><h2>Error 403: No tienes permisos para ver esto.</h2></div>;

const RootRedirect = () => {
  
  console.log("[RootRedirect] Defining to where redirect user...");

  if (!keycloak.authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (keycloak.hasRealmRole('admin')) {
    console.log("[RootRedirect] Has admin role. Redirecting to /admin");
    return <Navigate to="/admin" replace />;
  }
  
  if (keycloak.hasRealmRole('user')) {
    console.log("[RootRedirect] Has user role. Redirecting to /home");
    return <Navigate to="/home" replace />;
  }
  
  console.warn("[RootRedirect] No valid role. Redirecti ng to /no-autorizado");
  return <Navigate to="/no-autorizado" replace />;
};

function App() {

  const hasSynced = useRef(false);

  useEffect(() => {

    if (keycloak.authenticated && !hasSynced.current) {
      const saveUserInDatabase = async () => {
        try {
          await api.post(
            '/user/sync',
            {
              id: keycloak.tokenParsed.sub,
              firstName: keycloak.tokenParsed.given_name,
              lastName: keycloak.tokenParsed.family_name,
              email: keycloak.tokenParsed.email,
            },
          );
          console.log('User synced with database');
          hasSynced.current = true;
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      };

      saveUserInDatabase();
    }
  }, [keycloak.authenticated]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={keycloak.authenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/home" element={<ProtectedRoute requiredRole="user"><HomeMenu onLogout={() => keycloak.logout({redirectUri: window.location.origin})} /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminHomeMenu onLogout={() => keycloak.logout({redirectUri: window.location.origin})} /></ProtectedRoute> } />
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        <Route path="/packages" element={<ProtectedRoute requiredRole="user"><ListPackages/></ProtectedRoute>}/>
        
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />  
      </Routes>
    </div>
  );
}

export default App;