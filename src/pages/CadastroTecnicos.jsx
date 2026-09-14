import { useState } from "react";

export default function CadastroTecnicos() {
  const [tecnicos, setTecnicos] = useState([]);
  const [form, setForm] = useState({ nome: "", especialidade: "", disponivel: "sim" });
  const [feedback, setFeedback] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.especialidade) {
      setFeedback("erro:Preencha nome e especialidade.");
      return;
    }
    setTecnicos([...tecnicos, form]);
    setForm({ nome: "", especialidade: "", disponivel: "sim" });
    setFeedback("ok:Técnico cadastrado com sucesso.");
  }

  function handleDelete(index) {
    setTecnicos(tecnicos.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="page-header">
        <h1>Cadastro de Técnicos</h1>
        <p>Gerencie a equipe técnica responsável pelos atendimentos.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {feedback.startsWith("erro:") && <div className="error-msg">{feedback.replace("erro:", "")}</div>}
        {feedback.startsWith("ok:") && <div className="success-msg">{feedback.replace("ok:", "")}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome do técnico</label>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
            </div>
            <div className="form-group">
              <label>Especialidade</label>
              <input name="especialidade" value={form.especialidade} onChange={handleChange} placeholder="Ex: Redes, Fibra óptica" />
            </div>
          </div>
          <div className="form-group">
            <label>Disponibilidade</label>
            <select name="disponivel" value={form.disponivel} onChange={handleChange}>
              <option value="sim">Disponível</option>
              <option value="nao">Indisponível</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" style={{ width: "auto" }}>Cadastrar técnico</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 15, marginBottom: 8 }}>Técnicos cadastrados</h2>
        {tecnicos.length === 0 ? (
          <div className="empty-state">Nenhum técnico cadastrado ainda.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Especialidade</th>
                <th>Disponibilidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tecnicos.map((t, i) => (
                <tr key={i}>
                  <td>{t.nome}</td>
                  <td>{t.especialidade}</td>
                  <td>{t.disponivel === "sim" ? "Disponível" : "Indisponível"}</td>
                  <td><button className="btn-secondary" onClick={() => handleDelete(i)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
