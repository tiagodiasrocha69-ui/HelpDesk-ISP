
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { autenticacaoApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sessão ao carregar o sistema

  useEffect(() => {

    let ativo = true;

    async function verificarSessao() {

      try {

        const usuario =
          await autenticacaoApi.usuarioAtual();

        if (ativo) {
          setUser(usuario);
        }

      } catch {

        if (ativo) {
          setUser(null);
        }

      } finally {

        if (ativo) {
          setLoading(false);
        }

      }
    }

    verificarSessao();

    return () => {
      ativo = false;
    };

  }, []);


  // Login real

  async function login(loginInput, senhaInput) {

    try {

      const resposta = await autenticacaoApi.login(
        loginInput,
        senhaInput
      );

      setUser(resposta.usuario);

      return {
        ok: true
      };

    } catch (erro) {

      return {
        ok: false,
        message: erro.message
      };

    }

  }


  // Logout real

  async function logout() {

    try {

      await autenticacaoApi.logout();

      setUser(null);

      return {
        ok: true
      };

    } catch (erro) {

      return {
        ok: false,
        message: erro.message
      };

    }

  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}
