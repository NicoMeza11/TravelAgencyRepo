import { Routes, Route, Navigate, redirect } from 'react-router-dom';
import keycloak from './keycloak';
import ProtectedRoute from './components/ProtectedRoute'; 
import LoginPage from './pages/LoginPage';
import HomeMenu from './components/HomeMenu';
import { useEffect } from 'react';
import axios from 'axios';


const DashboardAdmin = () => <div><h1>Panel de Administración</h1><p>Gestión de reservas y paquetes.</p></div>;
const NoAutorizado = () => <div><h2>Error 403: No tienes permisos para ver esto.</h2></div>;

const RootRedirect = () => {

  useEffect(() => {

    if (keycloak.authenticated) {
      const saveUserInDatabase = async () => {
        try {
          await axios.post(
            'http://localhost:8080/api/user/sync',
            {
              id: keycloak.tokenParsed.sub,
              firstName: keycloak.tokenParsed.given_name,
              lastName: keycloak.tokenParsed.family_name,
              email: keycloak.tokenParsed.email,
            },
            {
              headers: { Authorization: `Bearer ${keycloak.token}` }
            }
          );
          console.log('User synced with database');
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      };


      saveUserInDatabase();
    }
  }, [keycloak.authenticated]);
  
  console.log("[RootRedirect] Decidiendo a dónde enviar al usuario...");

  if (!keycloak.authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (keycloak.hasRealmRole('admin')) {
    console.log("[RootRedirect] Es admin. Enviando a /admin");
    return <Navigate to="/admin" replace />;
  }
  
  if (keycloak.hasRealmRole('user')) {
    console.log("[RootRedirect] Es user. Enviando a /home");
    return <Navigate to="/home" replace />;
  }
  
  console.warn("[RootRedirect] No tiene roles válidos. Enviando a /no-autorizado");
  return <Navigate to="/no-autorizado" replace />;
};

function App() {
  console.log("Roles del usuario:", keycloak.realmAccess?.roles);

  return (
    <div>
      <Routes>
        <Route path="/login" element={keycloak.authenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/home" element={<ProtectedRoute requiredRole="user"><HomeMenu onLogout={() => keycloak.logout({redirectUri: window.location.origin})} /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><DashboardAdmin /></ProtectedRoute> } />
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />  
      </Routes>
    </div>
  );
}

export default App;