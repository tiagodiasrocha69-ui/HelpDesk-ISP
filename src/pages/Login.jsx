import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!loginInput || !senha) {
      setError("Informe usuário e senha.");
      return;
    }

    const result = login(loginInput, senha);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/");
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>HelpDesk ISP</h1>
        <p className="login-subtitle">Sistema de Gerenciamento de Chamados</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Usuário</label>
            <input
              id="login"
              type="text"
              placeholder="Digite seu usuário"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">Entrar</button>
        </form>

        <p className="login-hint">
          Demonstração — atendente / tecnico / admin, senha: 123456
        </p>
      </div>
    </div>
  );
}
