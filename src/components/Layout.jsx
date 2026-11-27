
import { useState } from "react";

import {
  NavLink,
  useNavigate,
  Outlet
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function Layout() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");


  async function handleLogout() {

    setSaindo(true);
    setErro("");

    try {

      const result = await logout();

      if (!result.ok) {

        setErro(result.message);

        return;

      }

      navigate("/login", { replace: true });

    } finally {

      setSaindo(false);

    }

  }


  return (

    <div className="app-shell">

      <header className="topbar">

        <div className="topbar-brand">
          HelpDesk ISP
        </div>

        <nav className="topbar-nav">

          <NavLink to="/" end>
            Dashboard
          </NavLink>

          <NavLink to="/chamados">

            {user?.perfil === "tecnico"
              ? "Meus Chamados"
              : "Chamados"}

          </NavLink>


          {[
            "administrador",
            "atendente"
          ].includes(user?.perfil) && (

            <>

              <NavLink to="/clientes">
                Clientes
              </NavLink>

              <NavLink to="/chamados/novo">
                Novo Chamado
              </NavLink>

            </>

          )}


          {user?.perfil === "administrador" && (

            <>

              <NavLink to="/tecnicos">
                Técnicos
              </NavLink>

              <NavLink to="/usuarios">
                Usuários
              </NavLink>

            </>

          )}


          {[
            "administrador",
            "atendente",
            "gerente"
          ].includes(user?.perfil) && (

            <NavLink to="/relatorios">

              Relatórios

            </NavLink>

          )}

        </nav>


        <div className="topbar-user">

          <span>{user?.nome}</span>

          <span className="badge-role">
            {user?.perfil}
          </span>

          <button
            className="btn-secondary"
            onClick={handleLogout}
            disabled={saindo}
          >

            {saindo ? "Saindo..." : "Sair"}

          </button>

        </div>

      </header>


      <main className="page-content">

        {erro && (

          <div className="error-msg">
            {erro}
          </div>

        )}

        <Outlet />

      </main>

    </div>

  );

}
