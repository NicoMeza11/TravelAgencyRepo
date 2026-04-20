import { Routes, Route, Navigate } from 'react-router-dom';
import keycloak from './keycloak';
import ProtectedRoute from './components/ProtectedRoute'; 
import LoginPage from './pages/LoginPage';
import Menu from './components/Menu';


const DashboardAdmin = () => <div><h1>Panel de Administración</h1><p>Gestión de reservas y paquetes.</p></div>;
const NoAutorizado = () => <div><h2>Error 403: No tienes permisos para ver esto.</h2></div>;

const RootRedirect = () => {
  
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
      {keycloak.authenticated && (
        <nav style={{ marginBottom: '20px', padding: '10px', background: '#eee' }}>
          <span>Usuario logueado: {keycloak.tokenParsed?.preferred_username} </span>
          <button onClick={() => keycloak.logout()}>Cerrar Sesión</button>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={keycloak.authenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/home" element={<ProtectedRoute requiredRole="user"><Menu /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><DashboardAdmin /></ProtectedRoute> } />
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />  
      </Routes>
    </div>
  );
}

export default App;