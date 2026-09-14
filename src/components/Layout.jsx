import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">HelpDesk ISP</div>

        <nav className="topbar-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          {(user?.perfil === "atendente" || user?.perfil === "administrador") && (
            <>
              <NavLink to="/clientes">Clientes</NavLink>
              <NavLink to="/chamados/novo">Novo Chamado</NavLink>
            </>
          )}
          {(user?.perfil === "administrador") && (
            <NavLink to="/tecnicos">Técnicos</NavLink>
          )}
        </nav>

        <div className="topbar-user">
          <span>{user?.nome}</span>
          <span className="badge-role">{user?.perfil}</span>
          <button className="btn-secondary" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
