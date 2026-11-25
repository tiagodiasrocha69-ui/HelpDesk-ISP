
import { useState, useEffect } from "react";
import { tecnicosApi } from "../api";

const FORM_INICIAL = {
  nome: "",
  telefone: "",
  especialidade: "",
  status: "Disponível",
  login: "",
  senha: ""
};

export default function CadastroTecnicos() {

  const [tecnicos, setTecnicos] = useState([]);
  const [form, setForm] = useState({ ...FORM_INICIAL });
  const [editId, setEditId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);


  async function carregarTecnicos() {

    setCarregando(true);

    try {

      const dados = await tecnicosApi.listar();

      setTecnicos(dados);

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    carregarTecnicos();

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

    if (!form.nome.trim() || !form.telefone.trim()) {

      setFeedback("erro:Informe nome e telefone.");

      return;

    }

    if (
      editId === null &&
      (!form.login.trim() || form.senha.trim().length < 6)
    ) {

      setFeedback(
        "erro:Informe login e senha com pelo menos 6 caracteres."
      );

      return;

    }

    setOcupado(true);

    try {

      let resposta;

      if (editId !== null) {

        resposta = await tecnicosApi.editar(editId, {
          nome: form.nome,
          telefone: form.telefone,
          especialidade: form.especialidade,
          status: form.status
        });

      } else {

        resposta = await tecnicosApi.cadastrar(form);

      }

      setFeedback(`ok:${resposta.mensagem}`);

      limparFormulario();

      await carregarTecnicos();

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  function handleEdit(tecnico) {

    setForm({
      nome: tecnico.nome || "",
      telefone: tecnico.telefone || "",
      especialidade: tecnico.especialidade || "",
      status: tecnico.status || "Disponível",
      login: tecnico.login || "",
      senha: ""
    });

    setEditId(tecnico.id);

    setFeedback("");

  }


  async function handleDelete(tecnico) {

    if (ocupado) return;

    if (!window.confirm(
      `Deseja excluir o técnico ${tecnico.nome}?`
    )) {
      return;
    }

    setOcupado(true);

    try {

      const resposta = await tecnicosApi.excluir(
        tecnico.id
      );

      if (editId === tecnico.id) {
        limparFormulario();
      }

      setFeedback(`ok:${resposta.mensagem}`);

      await carregarTecnicos();

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  return (
    <div>

      <div className="page-header">

        <h1>Cadastro de Técnicos</h1>

        <p>
          Gerencie a equipe técnica responsável pelos atendimentos.
        </p>

      </div>


      <div className="card" style={{ marginBottom: 24 }}>

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

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label>Nome do técnico</label>

              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                required
              />

            </div>

            <div className="form-group">

              <label>Telefone</label>

              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />

            </div>

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>Especialidade</label>

              <input
                name="especialidade"
                value={form.especialidade}
                onChange={handleChange}
                placeholder="Ex: Redes, Fibra óptica"
              />

            </div>

            <div className="form-group">

              <label>Disponibilidade</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option value="Disponível">
                  Disponível
                </option>

                <option value="Ocupado">
                  Ocupado
                </option>

                <option value="Inativo">
                  Inativo
                </option>

              </select>

            </div>

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>Login de acesso</label>

              <input
                name="login"
                value={form.login}
                onChange={handleChange}
                placeholder="Usuário do técnico"
                autoComplete="off"
                disabled={editId !== null}
                required
              />

            </div>

            {editId === null && (

              <div className="form-group">

                <label>Senha de acesso</label>

                <input
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  minLength={6}
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
                : "Cadastrar técnico"}

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


      <div className="card">

        <h2 style={{ fontSize: 15, marginBottom: 8 }}>
          Técnicos cadastrados
        </h2>

        {carregando ? (

          <div className="empty-state">
            Carregando técnicos...
          </div>

        ) : tecnicos.length === 0 ? (

          <div className="empty-state">
            Nenhum técnico cadastrado ainda.
          </div>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table>

              <thead>

                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Especialidade</th>
                  <th>Disponibilidade</th>
                  <th>Login</th>
                  <th>Ações</th>
                </tr>

              </thead>

              <tbody>

                {tecnicos.map((t) => (

                  <tr key={t.id}>

                    <td>{t.nome}</td>
                    <td>{t.telefone}</td>
                    <td>{t.especialidade || "-"}</td>
                    <td>{t.status}</td>
                    <td>{t.login || "-"}</td>

                    <td>

                      <button
                        className="btn-secondary"
                        style={{ marginRight: 6 }}
                        onClick={() => handleEdit(t)}
                        disabled={ocupado}
                      >
                        Editar
                      </button>

                      <button
                        className="btn-secondary"
                        onClick={() => handleDelete(t)}
                        disabled={ocupado}
                      >
                        Excluir
                      </button>

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
