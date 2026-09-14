import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CadastroClientes from "./pages/CadastroClientes";
import CadastroTecnicos from "./pages/CadastroTecnicos";
import AberturaChamado from "./pages/AberturaChamado";

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/clientes"
              element={
                <ProtectedRoute allowedRoles={["atendente", "administrador"]}>
                  <CadastroClientes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tecnicos"
              element={
                <ProtectedRoute allowedRoles={["administrador"]}>
                  <CadastroTecnicos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chamados/novo"
              element={
                <ProtectedRoute allowedRoles={["atendente", "administrador"]}>
                  <AberturaChamado />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
