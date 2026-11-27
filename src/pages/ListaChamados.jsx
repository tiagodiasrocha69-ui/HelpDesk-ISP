
import { useState, useEffect } from "react";
import { chamadosApi, tecnicosApi } from "../api";
import { useAuth } from "../context/AuthContext";

const CLASSES_PRIORIDADE = {
  Alta: "alta",
  Média: "media",
  Baixa: "baixa"
};

export default function ListaChamados() {

  const { user } = useAuth();

  const [chamados, setChamados] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [busca, setBusca] = useState("");

  const [selecionado, setSelecionado] = useState(null);
  const [tecnicoId, setTecnicoId] = useState("");
  const [observacao, setObservacao] = useState("");
  const [historico, setHistorico] = useState([]);

  const [feedback, setFeedback] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);

  const podeAtribuir = [
    "administrador",
    "atendente"
  ].includes(user?.perfil);

  const podeAtualizar = [
    "administrador",
    "tecnico"
  ].includes(user?.perfil);


  async function carregarDados() {

    setCarregando(true);

    try {

      const filtros = {};

      if (filtroStatus) {
        filtros.status = filtroStatus;
      }

      if (filtroPrioridade) {
        filtros.prioridade = filtroPrioridade;
      }

      const lista = await chamadosApi.listar(filtros);

      setChamados(lista);

      if (podeAtribuir) {

        const listaTecnicos = await tecnicosApi.listar();

        setTecnicos(listaTecnicos);

      }

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    carregarDados();

  }, [filtroStatus, filtroPrioridade, podeAtribuir]);


  function formatarData(data) {

    if (!data) return "-";

    const valor = new Date(
      data.replace(" ", "T") + "Z"
    );

    if (Number.isNaN(valor.getTime())) {
      return data;
    }

    return valor.toLocaleString("pt-BR");

  }


  async function abrirDetalhes(chamado) {

    setOcupado(true);
    setFeedback("");

    try {

      const dados = await chamadosApi.consultar(
        chamado.id
      );

      const registros = await chamadosApi.historico(
        chamado.id
      );

      setSelecionado(dados);

      setTecnicoId(
        dados.tecnico_id
          ? String(dados.tecnico_id)
          : ""
      );

      setObservacao("");
      setHistorico(registros);

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  async function atualizarDetalhes(id) {

    const [dados, registros] = await Promise.all([

      chamadosApi.consultar(id),

      chamadosApi.historico(id)

    ]);

    setSelecionado(dados);

    setTecnicoId(
      dados.tecnico_id
        ? String(dados.tecnico_id)
        : ""
    );

    setHistorico(registros);

    await carregarDados();

  }


  async function atribuirTecnico() {

    if (ocupado || !selecionado) return;

    if (!tecnicoId) {

      setFeedback("erro:Selecione um técnico.");

      return;

    }

    setOcupado(true);
    setFeedback("");

    try {

      const resposta = await chamadosApi.atribuir(
        selecionado.id,
        Number(tecnicoId)
      );

      setFeedback(`ok:${resposta.mensagem}`);

      await atualizarDetalhes(selecionado.id);

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  async function alterarStatus(novoStatus) {

    if (ocupado || !selecionado) return;

    if (
      novoStatus === "Concluído" &&
      !observacao.trim()
    ) {

      setFeedback(
        "erro:Descreva a solução do problema."
      );

      return;

    }

    if (
      novoStatus === "Concluído" &&
      !window.confirm("Deseja concluir este chamado?")
    ) {

      return;

    }

    setOcupado(true);
    setFeedback("");

    try {

      const resposta =
        await chamadosApi.atualizarStatus(
          selecionado.id,
          novoStatus,
          observacao.trim()
        );

      setFeedback(`ok:${resposta.mensagem}`);

      setObservacao("");

      await atualizarDetalhes(selecionado.id);

    } catch (erro) {

      setFeedback(`erro:${erro.message}`);

    } finally {

      setOcupado(false);

    }

  }


  const chamadosFiltrados = chamados.filter((c) => {

    const termo = busca.trim().toLowerCase();

    if (!termo) return true;

    return [

      String(c.id),
      c.cliente_nome,
      c.tecnico_nome,
      c.descricao

    ].some((valor) =>
      String(valor || "")
        .toLowerCase()
        .includes(termo)
    );

  });


  return (

    <div>

      <div className="page-header">

        <h1>
          {user?.perfil === "tecnico"
            ? "Meus Chamados"
            : "Gerenciamento de Chamados"}
        </h1>

        <p>
          Consulte e acompanhe os atendimentos técnicos.
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

        <h2 style={{ fontSize: 16, marginBottom: 16 }}>
          Filtros
        </h2>

        <div className="form-row">

          <div className="form-group">

            <label>Buscar chamado</label>

            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="ID, cliente, técnico ou descrição"
            />

          </div>

          <div className="form-group">

            <label>Status</label>

            <select
              value={filtroStatus}
              onChange={(e) =>
                setFiltroStatus(e.target.value)
              }
            >

              <option value="">Todos</option>
              <option value="Aberto">Aberto</option>
              <option value="Em Andamento">
                Em Andamento
              </option>
              <option value="Concluído">Concluído</option>

            </select>

          </div>

          <div className="form-group">

            <label>Prioridade</label>

            <select
              value={filtroPrioridade}
              onChange={(e) =>
                setFiltroPrioridade(e.target.value)
              }
            >

              <option value="">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>

            </select>

          </div>

        </div>

        <div className="form-actions">

          <button
            className="btn-secondary"
            onClick={() => {
              setBusca("");
              setFiltroStatus("");
              setFiltroPrioridade("");
            }}
          >
            Limpar filtros
          </button>

          <button
            className="btn-secondary"
            onClick={carregarDados}
            disabled={carregando || ocupado}
          >
            Atualizar lista
          </button>

        </div>

      </div>


      <div className="card" style={{ marginBottom: 24 }}>

        <h2 style={{ fontSize: 16, marginBottom: 16 }}>

          Chamados encontrados: {chamadosFiltrados.length}

        </h2>

        {carregando ? (

          <div className="empty-state">
            Carregando chamados...
          </div>

        ) : chamadosFiltrados.length === 0 ? (

          <div className="empty-state">
            Nenhum chamado encontrado.
          </div>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Técnico</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th>Abertura</th>
                  <th>Ações</th>

                </tr>

              </thead>

              <tbody>

                {chamadosFiltrados.map((c) => (

                  <tr key={c.id}>

                    <td>#{c.id}</td>

                    <td>{c.cliente_nome}</td>

                    <td>
                      {c.tecnico_nome || "Não atribuído"}
                    </td>

                    <td className={
                      `priority-${CLASSES_PRIORIDADE[c.prioridade] || ""}`
                    }>
                      {c.prioridade}
                    </td>

                    <td>{c.status}</td>

                    <td>
                      {formatarData(c.data_abertura)}
                    </td>

                    <td>

                      <button
                        className="btn-secondary"
                        onClick={() => abrirDetalhes(c)}
                        disabled={ocupado}
                      >
                        Detalhes
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {selecionado && (

        <div className="card" style={{ marginBottom: 24 }}>

          <div className="form-actions">

            <h2>Chamado #{selecionado.id}</h2>

            <button
              className="btn-secondary"
              onClick={() => setSelecionado(null)}
              disabled={ocupado}
            >
              Fechar detalhes
            </button>

          </div>

          <p>
            <strong>Cliente:</strong>{" "}
            {selecionado.cliente_nome}
          </p>

          <p>
            <strong>Telefone:</strong>{" "}
            {selecionado.cliente_telefone}
          </p>

          <p>
            <strong>Endereço:</strong>{" "}
            {selecionado.endereco}
          </p>

          <p>
            <strong>Descrição:</strong>{" "}
            {selecionado.descricao}
          </p>

          <p>
            <strong>Prioridade:</strong>{" "}
            {selecionado.prioridade}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {selecionado.status}
          </p>

          <p>
            <strong>Técnico:</strong>{" "}
            {selecionado.tecnico_nome || "Não atribuído"}
          </p>

          <p>
            <strong>Abertura:</strong>{" "}
            {formatarData(selecionado.data_abertura)}
          </p>

          <p>
            <strong>Encerramento:</strong>{" "}
            {formatarData(selecionado.data_encerramento)}
          </p>


          {podeAtribuir &&
            selecionado.status === "Aberto" && (

            <div style={{ marginTop: 24 }}>

              <h3>Atribuição de técnico</h3>

              <div className="form-group">

                <label>Selecione o técnico responsável</label>

                <select
                  value={tecnicoId}
                  onChange={(e) =>
                    setTecnicoId(e.target.value)
                  }
                  disabled={ocupado}
                >

                  <option value="">
                    Selecione um técnico
                  </option>

                  {tecnicos.filter(
                    (t) => t.status === "Disponível"
                  ).map((t) => (

                    <option key={t.id} value={t.id}>
                      {t.nome} - {t.especialidade || "Geral"}
                    </option>

                  ))}

                </select>

              </div>

              <button
                className="btn-primary"
                style={{ width: "auto" }}
                onClick={atribuirTecnico}
                disabled={ocupado || !tecnicoId}
              >
                Atribuir técnico
              </button>

            </div>

          )}


          {podeAtualizar &&
            selecionado.tecnico_id &&
            selecionado.status !== "Concluído" && (

            <div style={{ marginTop: 24 }}>

              <h3>Atualização do atendimento</h3>

              <div className="form-group">

                <label>

                  {selecionado.status === "Em Andamento"
                    ? "Solução do problema"
                    : "Observação (opcional)"}

                </label>

                <textarea
                  rows="3"
                  value={observacao}
                  onChange={(e) =>
                    setObservacao(e.target.value)
                  }
                  placeholder="Registre informações do atendimento"
                  disabled={ocupado}
                />

              </div>

              {selecionado.status === "Aberto" && (

                <button
                  className="btn-primary"
                  style={{ width: "auto" }}
                  onClick={() =>
                    alterarStatus("Em Andamento")
                  }
                  disabled={ocupado}
                >
                  Iniciar atendimento
                </button>

              )}

              {selecionado.status === "Em Andamento" && (

                <button
                  className="btn-primary"
                  style={{ width: "auto" }}
                  onClick={() =>
                    alterarStatus("Concluído")
                  }
                  disabled={ocupado}
                >
                  Concluir chamado
                </button>

              )}

            </div>

          )}


          <div style={{ marginTop: 32 }}>

            <h3>Histórico de movimentações</h3>

            {historico.length === 0 ? (

              <div className="empty-state">
                Nenhuma movimentação registrada.
              </div>

            ) : (

              <div style={{ overflowX: "auto" }}>

                <table>

                  <thead>

                    <tr>

                      <th>Data e hora</th>
                      <th>Responsável</th>
                      <th>Status anterior</th>
                      <th>Novo status</th>
                      <th>Observação</th>

                    </tr>

                  </thead>

                  <tbody>

                    {historico.map((h) => (

                      <tr key={h.id}>

                        <td>{formatarData(h.data_hora)}</td>

                        <td>{h.usuario_nome || "-"}</td>

                        <td>{h.status_anterior || "-"}</td>

                        <td>{h.status_novo || "-"}</td>

                        <td>{h.observacao || "-"}</td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      )}

    </div>

  );

}
