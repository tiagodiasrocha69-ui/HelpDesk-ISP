
import { useState, useEffect } from "react";
import { clientesApi } from "../api";

const FORM_INICIAL = {
  nome: "",
  cpf_cnpj: "",
  telefone: "",
  email: "",
  endereco: ""
};

export default function CadastroClientes() {

  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ ...FORM_INICIAL });
  const [editId, setEditId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);


  async function carregarClientes() {

    setCarregando(true);

    try {

      const dados = await clientesApi.listar();

      setClientes(dados);

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    carregarClientes();

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

    if (
      !form.nome.trim() ||
      !form.endereco.trim() ||
      !form.telefone.trim()
    ) {

      setFeedback(
        "erro:Informe nome, telefone e endereço."
      );

      return;

    }

    setOcupado(true);

    try {

      let resposta;

      if (editId !== null) {

        resposta = await clientesApi.editar(
          editId,
          form
        );

      } else {

        resposta = await clientesApi.cadastrar(form);

      }

      setFeedback(`ok:${resposta.mensagem}`);

      limparFormulario();

      await carregarClientes();

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  function handleEdit(cliente) {

    setForm({
      nome: cliente.nome || "",
      cpf_cnpj: cliente.cpf_cnpj || "",
      telefone: cliente.telefone || "",
      email: cliente.email || "",
      endereco: cliente.endereco || ""
    });

    setEditId(cliente.id);

    setFeedback("");

  }


  async function handleDelete(cliente) {

    if (ocupado) return;

    if (!window.confirm(
      `Deseja excluir o cliente ${cliente.nome}?`
    )) {
      return;
    }

    setOcupado(true);

    try {

      const resposta = await clientesApi.excluir(
        cliente.id
      );

      if (editId === cliente.id) {
        limparFormulario();
      }

      setFeedback(`ok:${resposta.mensagem}`);

      await carregarClientes();

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  return (
    <div>

      <div className="page-header">

        <h1>Cadastro de Clientes</h1>

        <p>
          Cadastre, edite ou remova clientes do HelpDesk ISP.
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

              <label>Nome do cliente</label>

              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                required
              />

            </div>

            <div className="form-group">

              <label>CPF/CNPJ</label>

              <input
                name="cpf_cnpj"
                value={form.cpf_cnpj}
                onChange={handleChange}
                placeholder="CPF ou CNPJ"
              />

            </div>

          </div>

          <div className="form-row">

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

            <div className="form-group">

              <label>E-mail</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="cliente@email.com"
              />

            </div>

          </div>

          <div className="form-group">

            <label>Endereço</label>

            <input
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Endereço completo"
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

              {ocupado
                ? "Aguarde..."
                : editId !== null
                ? "Salvar alterações"
                : "Cadastrar cliente"}

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
          Clientes cadastrados
        </h2>

        {carregando ? (

          <div className="empty-state">
            Carregando clientes...
          </div>

        ) : clientes.length === 0 ? (

          <div className="empty-state">
            Nenhum cliente cadastrado ainda.
          </div>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table>

              <thead>

                <tr>
                  <th>Nome</th>
                  <th>CPF/CNPJ</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Ações</th>
                </tr>

              </thead>

              <tbody>

                {clientes.map((c) => (

                  <tr key={c.id}>

                    <td>{c.nome}</td>
                    <td>{c.cpf_cnpj || "-"}</td>
                    <td>{c.telefone}</td>
                    <td>{c.endereco}</td>

                    <td>

                      <button
                        className="btn-secondary"
                        style={{ marginRight: 6 }}
                        onClick={() => handleEdit(c)}
                        disabled={ocupado}
                      >
                        Editar
                      </button>

                      <button
                        className="btn-secondary"
                        onClick={() => handleDelete(c)}
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
