
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles
}) {

  const { user, loading } = useAuth();


  // Aguardar verificação da sessão

  if (loading) {

    return (

      <div className="page-content">

        <p>Verificando sessão...</p>

      </div>

    );

  }


  // Verificar autenticação

  if (!user) {

    return (
      <Navigate to="/login" replace />
    );

  }


  // Verificar permissões

  if (
    allowedRoles &&
    !allowedRoles.includes(user.perfil)
  ) {

    return (

      <div className="access-denied">

        <h2>Acesso não autorizado</h2>

        <p>
          Seu perfil ({user.perfil}) não tem
          permissão para acessar esta página.
        </p>

      </div>

    );

  }


  return children;

}
