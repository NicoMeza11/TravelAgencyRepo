import { Navigate } from 'react-router-dom';
import keycloak from '../keycloak';

const ProtectedRoute = ({ children, requiredRole }) => {
  const hasRole = keycloak.hasRealmRole(requiredRole);

  console.log(`[ProtectedRoute] Evaluating access. Rol requested: "${requiredRole}". ¿Does he has it?:`, hasRole);

  if (!hasRole) {
    console.warn(`[ProtectedRoute] Acceso denied. Redirecting to /no-autorizado`);
    return <Navigate to="/no-autorizado" />;
  }

  console.log(`[ProtectedRoute] Acceso granted.`);
  return children;
};

export default ProtectedRoute;