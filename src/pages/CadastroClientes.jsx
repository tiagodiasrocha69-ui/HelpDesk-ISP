import { useState } from "react";

export default function CadastroClientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", endereco: "", telefone: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [feedback, setFeedback] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.endereco || !form.telefone) {
      setFeedback("erro:Preencha todos os campos.");
      return;
    }

    if (editIndex !== null) {
      const atualizados = [...clientes];
      atualizados[editIndex] = form;
      setClientes(atualizados);
      setEditIndex(null);
      setFeedback("ok:Cliente atualizado com sucesso.");
    } else {
      setClientes([...clientes, form]);
      setFeedback("ok:Cliente cadastrado com sucesso.");
    }
    setForm({ nome: "", endereco: "", telefone: "" });
  }

  function handleEdit(index) {
    setForm(clientes[index]);
    setEditIndex(index);
    setFeedback("");
  }

  function handleDelete(index) {
    setClientes(clientes.filter((_, i) => i !== index));
    setFeedback("ok:Cliente removido.");
  }

  return (
    <div>
      <div className="page-header">
        <h1>Cadastro de Clientes</h1>
        <p>Cadastre, edite ou remova clientes do HelpDesk ISP.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {feedback.startsWith("erro:") && (
          <div className="error-msg">{feedback.replace("erro:", "")}</div>
        )}
        {feedback.startsWith("ok:") && (
          <div className="success-msg">{feedback.replace("ok:", "")}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome do cliente</label>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
            </div>
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço completo" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" style={{ width: "auto" }}>
              {editIndex !== null ? "Salvar alterações" : "Cadastrar cliente"}
            </button>
            {editIndex !== null && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setForm({ nome: "", endereco: "", telefone: "" }); setEditIndex(null); }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 15, marginBottom: 8 }}>Clientes cadastrados</h2>
        {clientes.length === 0 ? (
          <div className="empty-state">Nenhum cliente cadastrado ainda.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr key={i}>
                  <td>{c.nome}</td>
                  <td>{c.telefone}</td>
                  <td>{c.endereco}</td>
                  <td>
                    <button className="btn-secondary" style={{ marginRight: 6 }} onClick={() => handleEdit(i)}>Editar</button>
                    <button className="btn-secondary" onClick={() => handleDelete(i)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
