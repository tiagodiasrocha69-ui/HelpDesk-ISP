
import { useState, useEffect } from "react";
import { usuariosApi } from "../api";
import { useAuth } from "../context/AuthContext";

const FORM_INICIAL = {
  nome: "",
  login: "",
  senha: "",
  perfil: "atendente"
};

export default function GerenciamentoUsuarios() {

  const { user } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ ...FORM_INICIAL });

  const [editId, setEditId] = useState(null);
  const [usuarioSenha, setUsuarioSenha] = useState(null);
  const [novaSenha, setNovaSenha] = useState("");

  const [busca, setBusca] = useState("");
  const [feedback, setFeedback] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);


  async function carregarUsuarios() {

    setCarregando(true);

    try {

      const dados = await usuariosApi.listar();

      setUsuarios(dados);

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    carregarUsuarios();

  }, []);


  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }


  function limparFormulario() {

    setForm({ ...FORM_INICIAL });
    setEditId(null);

  }


  async function handleSubmit(e) {

    e.preventDefault();

    if (ocupado) return;

    setFeedback("");
    setOcupado(true);

    try {

      let resposta;

      if (editId !== null) {

        resposta = await usuariosApi.editar(
          editId,
          {
            nome: form.nome,
            perfil: form.perfil
          }
        );

      } else {

        resposta = await usuariosApi.cadastrar(form);

      }

      setFeedback(`ok:${resposta.mensagem}`);

      limparFormulario();

      await carregarUsuarios();

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  function handleEdit(usuario) {

    setForm({
      nome: usuario.nome,
      login: usuario.login,
      perfil: usuario.perfil,
      senha: ""
    });

    setEditId(usuario.id);

    setFeedback("");

  }


  async function alterarStatus(usuario) {

    if (ocupado) return;

    const novoStatus = usuario.ativo ? 0 : 1;

    const acao = novoStatus ? "ativar" : "desativar";

    if (!window.confirm(
      `Deseja ${acao} a conta de ${usuario.nome}?`
    )) {

      return;

    }

    setOcupado(true);
    setFeedback("");

    try {

      const resposta =
        await usuariosApi.alterarStatus(
          usuario.id,
          novoStatus
        );

      setFeedback(`ok:${resposta.mensagem}`);

      await carregarUsuarios();

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  async function salvarNovaSenha(e) {

    e.preventDefault();

    if (!usuarioSenha || ocupado) return;

    if (novaSenha.length < 6) {

      setFeedback(
        "erro:A senha deve possuir pelo menos 6 caracteres."
      );

      return;

    }

    setOcupado(true);
    setFeedback("");

    try {

      const resposta =
        await usuariosApi.redefinirSenha(
          usuarioSenha.id,
          novaSenha
        );

      setFeedback(`ok:${resposta.mensagem}`);

      setUsuarioSenha(null);
      setNovaSenha("");

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  const filtrados = usuarios.filter((u) => {

    const termo = busca.toLowerCase().trim();

    return [

      u.nome,
      u.login,
      u.perfil

    ].some((valor) =>

      String(valor || "")
        .toLowerCase()
        .includes(termo)

    );

  });


  return (

    <div>

      <div className="page-header">

        <h1>Gerenciamento de Usuários</h1>

        <p>
          Gerencie as contas e permissões do HelpDesk ISP.
        </p>

      </div>


      {feedback.startsWith("erro:") && (

        <div className="error-msg">
          {feedback.slice(5)}
        </div>

      )}

      {feedback.startsWith("ok:") && (

        <div className="success-msg">
          {feedback.slice(3)}
        </div>

      )}


      <div className="card" style={{ marginBottom: 24 }}>

        <h2 style={{ marginBottom: 20 }}>

          {editId !== null
            ? "Editar usuário"
            : "Novo usuário"}

        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label>Nome completo</label>

              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Login</label>

              <input
                name="login"
                value={form.login}
                onChange={handleChange}
                disabled={editId !== null}
                autoComplete="off"
                required
              />

            </div>

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>Perfil de acesso</label>

              <select
                name="perfil"
                value={form.perfil}
                onChange={handleChange}
                disabled={editId === user?.id}
              >

                <option value="administrador">
                  Administrador
                </option>

                <option value="atendente">
                  Atendente
                </option>

                <option value="gerente">
                  Gerente
                </option>

              </select>

            </div>


            {editId === null && (

              <div className="form-group">

                <label>Senha inicial</label>

                <input
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  required
                />

              </div>

            )}

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "auto" }}
              disabled={ocupado}
            >

              {ocupado
                ? "Aguarde..."
                : editId !== null
                ? "Salvar alterações"
                : "Cadastrar usuário"}

            </button>


            {editId !== null && (

              <button
                type="button"
                className="btn-secondary"
                onClick={limparFormulario}
                disabled={ocupado}
              >

                Cancelar

              </button>

            )}

          </div>

        </form>

      </div>


      {usuarioSenha && (

        <div
          className="card"
          style={{ marginBottom: 24 }}
        >

          <h2 style={{ marginBottom: 16 }}>

            Redefinir senha

          </h2>

          <p style={{ marginBottom: 16 }}>

            Usuário: {usuarioSenha.nome}

          </p>

          <form onSubmit={salvarNovaSenha}>

            <div className="form-group">

              <label>Nova senha</label>

              <input
                type="password"
                value={novaSenha}
                onChange={(e) =>
                  setNovaSenha(e.target.value)
                }
                autoComplete="new-password"
                minLength={6}
                required
              />

            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "auto" }}
                disabled={ocupado}
              >

                Salvar nova senha

              </button>

              <button
                type="button"
                className="btn-secondary"
                disabled={ocupado}
                onClick={() => {

                  setUsuarioSenha(null);
                  setNovaSenha("");

                }}
              >

                Cancelar

              </button>

            </div>

          </form>

        </div>

      )}


      <div className="card">

        <h2 style={{ marginBottom: 16 }}>

          Usuários cadastrados

        </h2>

        <div className="form-group">

          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, login ou perfil"
          />

        </div>


        {carregando ? (

          <div className="empty-state">

            Carregando usuários...

          </div>

        ) : filtrados.length === 0 ? (

          <div className="empty-state">

            Nenhum usuário encontrado.

          </div>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table>

              <thead>

                <tr>

                  <th>Nome</th>
                  <th>Login</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Ações</th>

                </tr>

              </thead>

              <tbody>

                {filtrados.map((u) => (

                  <tr key={u.id}>

                    <td>{u.nome}</td>

                    <td>{u.login}</td>

                    <td>{u.perfil}</td>

                    <td style={{
                      color: u.ativo
                        ? "#16a34a"
                        : "#dc2626"
                    }}>

                      {u.ativo ? "Ativo" : "Inativo"}

                    </td>

                    <td>

                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6
                      }}>

                        {u.perfil !== "tecnico" && (

                          <button
                            className="btn-secondary"
                            onClick={() => handleEdit(u)}
                            disabled={ocupado}
                          >

                            Editar

                          </button>

                        )}


                        {u.id !== user?.id &&
                          u.perfil !== "tecnico" && (

                          <button
                            className="btn-secondary"
                            onClick={() => alterarStatus(u)}
                            disabled={ocupado}
                          >

                            {u.ativo
                              ? "Desativar"
                              : "Ativar"}

                          </button>

                        )}


                        <button
                          className="btn-secondary"
                          disabled={ocupado}
                          onClick={() => {

                            setUsuarioSenha(u);
                            setNovaSenha("");
                            setFeedback("");

                          }}
                        >

                          Redefinir senha

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}
