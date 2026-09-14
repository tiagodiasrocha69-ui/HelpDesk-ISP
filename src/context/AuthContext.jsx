import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Usuários de demonstração (mock). Na integração com back-end,
// isso deve ser substituído por uma chamada de API de autenticação.
const MOCK_USERS = [
  { login: "atendente", senha: "123456", nome: "Ana Souza", perfil: "atendente" },
  { login: "tecnico", senha: "123456", nome: "Carlos Lima", perfil: "tecnico" },
  { login: "admin", senha: "123456", nome: "Marcos Dias", perfil: "administrador" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(loginInput, senhaInput) {
    const found = MOCK_USERS.find(
      (u) => u.login === loginInput && u.senha === senhaInput
    );
    if (!found) {
      return { ok: false, message: "Usuário ou senha inválidos." };
    }
    setUser(found);
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
