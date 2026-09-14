import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1>Olá, {user?.nome}</h1>
        <p>Visão geral do HelpDesk ISP — Sprint 1</p>
      </div>

      <div className="card">
        <p>
          Você está autenticado com o perfil <strong>{user?.perfil}</strong>.
          Use o menu acima para acessar as funcionalidades liberadas para o seu perfil.
        </p>
      </div>
    </div>
  );
}
