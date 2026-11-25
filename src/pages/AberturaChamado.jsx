
import { useState, useEffect } from "react";
import { clientesApi, chamadosApi } from "../api";

const FORM_INICIAL = {
  cliente_id: "",
  descricao: "",
  prioridade: "Média",
  endereco: ""
};

const CLASSES_PRIORIDADE = {
  Alta: "alta",
  Média: "media",
  Baixa: "baixa"
};

export default function AberturaChamado() {

  const [clientes, setClientes] = useState([]);
  const [chamados, setChamados] = useState([]);
  const [form, setForm] = useState({ ...FORM_INICIAL });
  const [feedback, setFeedback] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);


  async function carregarDados() {

    setCarregando(true);

    try {

      const [listaClientes, listaChamados] =
        await Promise.all([
          clientesApi.listar(),
          chamadosApi.listar()
        ]);

      setClientes(listaClientes);

      setChamados(listaChamados);

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    carregarDados();

  }, []);


  function handleChange(e) {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  }


  function selecionarCliente(e) {

    const id = e.target.value;

    const cliente = clientes.find(
      (c) => String(c.id) === id
    );

    setForm({
      ...form,
      cliente_id: id,
      endereco: cliente?.endereco || ""
    });

  }


  async function handleSubmit(e) {

    e.preventDefault();

    if (ocupado) return;

    setFeedback("");

    if (
      !form.cliente_id ||
      !form.descricao.trim() ||
      !form.endereco.trim()
    ) {

      setFeedback(
        "erro:Preencha todos os campos obrigatórios."
      );

      return;

    }

    setOcupado(true);

    try {

      const resposta = await chamadosApi.cadastrar({

        cliente_id: Number(form.cliente_id),

        descricao: form.descricao.trim(),

        prioridade: form.prioridade,

        endereco: form.endereco.trim()

      });

      setFeedback(
        `ok:Chamado #${resposta.id} registrado com sucesso.`
      );

      setForm({ ...FORM_INICIAL });

      await carregarDados();

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  function formatarData(data) {

    if (!data) return "-";

    const valor = new Date(
      data.replace(" ", "T") + "Z"
    );

    if (Number.isNaN(valor.getTime())) {
      return data;
    }

    return valor.toLocaleDateString("pt-BR");

  }


  return (
    <div>

      <div className="page-header">

        <h1>Abertura de Chamado</h1>

        <p>
          Registre um novo chamado técnico para um cliente.
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

        {!carregando && clientes.length === 0 && (

          <div className="error-msg">

            Cadastre pelo menos um cliente antes de abrir
            um chamado.

          </div>

        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Cliente</label>

            <select
              name="cliente_id"
              value={form.cliente_id}
              onChange={selecionarCliente}
              required
              disabled={carregando}
            >

              <option value="">
                Selecione um cliente
              </option>

              {clientes.map((cliente) => (

                <option
                  key={cliente.id}
                  value={cliente.id}
                >

                  {cliente.nome} - {cliente.telefone}

                </option>

              ))}

            </select>

          </div>


          <div className="form-group">

            <label>Descrição do problema</label>

            <textarea
              name="descricao"
              rows="3"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva o problema relatado pelo cliente"
              required
            />

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>Prioridade</label>

              <select
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
              >

                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>

              </select>

            </div>


            <div className="form-group">

              <label>Endereço do atendimento</label>

              <input
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Endereço completo"
                required
              />

            </div>

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "auto" }}
              disabled={
                ocupado ||
                carregando ||
                clientes.length === 0
              }
            >

              {ocupado ? "Registrando..." : "Abrir chamado"}

            </button>

          </div>

        </form>

      </div>


      <div className="card">

        <h2 style={{ fontSize: 15, marginBottom: 8 }}>
          Chamados registrados
        </h2>

        {carregando ? (

          <div className="empty-state">
            Carregando chamados...
          </div>

        ) : chamados.length === 0 ? (

          <div className="empty-state">
            Nenhum chamado registrado ainda.
          </div>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>

              </thead>

              <tbody>

                {chamados.map((c) => (

                  <tr key={c.id}>

                    <td>#{c.id}</td>

                    <td>{c.cliente_nome}</td>

                    <td
                      className={
                        `priority-${CLASSES_PRIORIDADE[c.prioridade] || ""}`
                      }
                    >

                      {c.prioridade}

                    </td>

                    <td>{c.status}</td>

                    <td>
                      {formatarData(c.data_abertura)}
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
