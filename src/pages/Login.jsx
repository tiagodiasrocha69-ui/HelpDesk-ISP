
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const [loginInput, setLoginInput] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();


  async function handleSubmit(e) {

    e.preventDefault();

    setError("");

    if (enviando) {
      return;
    }

    if (!loginInput.trim() || !senha) {

      setError("Informe usuário e senha.");

      return;

    }

    setEnviando(true);

    try {

      const result = await login(
        loginInput.trim(),
        senha
      );

      if (!result.ok) {

        setError(result.message);

        return;

      }

      navigate("/", { replace: true });

    } catch {

      setError("Não foi possível realizar o login.");

    } finally {

      setEnviando(false);

    }

  }


  return (

    <div className="login-wrapper">

      <div className="login-card">

        <h1>HelpDesk ISP</h1>

        <p className="login-subtitle">
          Sistema de Gerenciamento de Chamados
        </p>

        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="login">
              Usuário
            </label>

            <input
              id="login"
              type="text"
              placeholder="Digite seu usuário"
              value={loginInput}
              onChange={(e) =>
                setLoginInput(e.target.value)
              }
              autoComplete="username"
              disabled={enviando}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="senha">
              Senha
            </label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              autoComplete="current-password"
              disabled={enviando}
              required
            />

          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={enviando}
          >

            {enviando ? "Entrando..." : "Entrar"}

          </button>

        </form>

      </div>

    </div>

  );

}
