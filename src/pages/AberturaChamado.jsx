import { useState } from "react";

const CHAMADOS_INICIAIS = [];

export default function AberturaChamado() {
  const [chamados, setChamados] = useState(CHAMADOS_INICIAIS);
  const [form, setForm] = useState({
    cliente: "",
    descricao: "",
    prioridade: "media",
    endereco: "",
  });
  const [feedback, setFeedback] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.cliente || !form.descricao || !form.endereco) {
      setFeedback("erro:Preencha todos os campos obrigatórios.");
      return;
    }

    const novoChamado = {
      id: chamados.length + 1,
      ...form,
      status: "Aberto",
      data: new Date().toLocaleDateString("pt-BR"),
    };

    setChamados([novoChamado, ...chamados]);
    setForm({ cliente: "", descricao: "", prioridade: "media", endereco: "" });
    setFeedback("ok:Chamado registrado com sucesso e disponível para atribuição.");
  }

  return (
    <div>
      <div className="page-header">
        <h1>Abertura de Chamado</h1>
        <p>Registre um novo chamado técnico para um cliente.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {feedback.startsWith("erro:") && <div className="error-msg">{feedback.replace("erro:", "")}</div>}
        {feedback.startsWith("ok:") && <div className="success-msg">{feedback.replace("ok:", "")}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cliente</label>
            <input name="cliente" value={form.cliente} onChange={handleChange} placeholder="Nome do cliente" />
          </div>

          <div className="form-group">
            <label>Descrição do problema</label>
            <textarea
              name="descricao"
              rows="3"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva o problema relatado pelo cliente"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prioridade</label>
              <select name="prioridade" value={form.prioridade} onChange={handleChange}>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Endereço do atendimento</label>
              <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço completo" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" style={{ width: "auto" }}>Abrir chamado</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 15, marginBottom: 8 }}>Chamados abertos nesta sessão</h2>
        {chamados.length === 0 ? (
          <div className="empty-state">Nenhum chamado registrado ainda.</div>
        ) : (
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
                  <td>{c.cliente}</td>
                  <td className={`priority-${c.prioridade}`}>
                    {c.prioridade === "alta" ? "Alta" : c.prioridade === "media" ? "Média" : "Baixa"}
                  </td>
                  <td>{c.status}</td>
                  <td>{c.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
