import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege uma rota exigindo login e, opcionalmente, um ou mais
 * perfis autorizados (controle de acesso por perfil de usuário).
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.perfil)) {
    return (
      <div className="access-denied">
        <h2>Acesso não autorizado</h2>
        <p>Seu perfil ({user.perfil}) não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return children;
}
