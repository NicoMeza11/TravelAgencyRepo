import { Navigate } from 'react-router-dom';
import keycloak from '../keycloak';

const ProtectedRoute = ({ children, requiredRole }) => {
  const hasRole = keycloak.hasRealmRole(requiredRole);

  console.log(`[ProtectedRoute] Evaluando acceso. Rol requerido: "${requiredRole}". ¿Lo tiene?:`, hasRole);

  if (!hasRole) {
    console.warn(`[ProtectedRoute] Acceso denegado. Redirigiendo a /no-autorizado`);
    return <Navigate to="/no-autorizado" />;
  }

  console.log(`[ProtectedRoute] Acceso concedido.`);
  return children;
};

export default ProtectedRoute;