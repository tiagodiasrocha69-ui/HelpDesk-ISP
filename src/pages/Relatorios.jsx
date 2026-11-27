
import { useState, useEffect } from "react";
import { relatoriosApi, tecnicosApi } from "../api";

const FILTROS_INICIAIS = {
  data_inicio: "",
  data_fim: "",
  tecnico_id: "",
  status: "",
  prioridade: ""
};


function Indicador({ titulo, valor, cor }) {

  return (

    <div className="card">

      <p style={{
        color: "#64748b",
        marginBottom: 12
      }}>
        {titulo}
      </p>

      <h2 style={{
        color: cor,
        fontSize: 30
      }}>
        {valor}
      </h2>

    </div>

  );

}


function Barra({ titulo, quantidade, total, cor }) {

  const percentual =
    total > 0
      ? quantidade / total * 100
      : 0;

  return (

    <div style={{ marginBottom: 18 }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8
      }}>

        <span>{titulo}</span>

        <strong>{quantidade}</strong>

      </div>

      <div style={{
        height: 12,
        background: "#e5e7eb",
        borderRadius: 6,
        overflow: "hidden"
      }}>

        <div style={{
          height: "100%",
          width: `${percentual}%`,
          background: cor
        }} />

      </div>

    </div>

  );

}


export default function Relatorios() {

  const [filtros, setFiltros] = useState({
    ...FILTROS_INICIAIS
  });

  const [aplicados, setAplicados] = useState({
    ...FILTROS_INICIAIS
  });

  const [tecnicos, setTecnicos] = useState([]);
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);


  async function gerarRelatorio(
    filtrosConsulta = filtros
  ) {

    setCarregando(true);
    setErro("");

    try {

      const resultado = await relatoriosApi.gerar(
        filtrosConsulta
      );

      setDados(resultado);

      setAplicados({ ...filtrosConsulta });

    } catch (error) {

      setErro(error.message);

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    async function iniciar() {

      try {

        const lista = await tecnicosApi.listar();

        setTecnicos(lista);

      } catch (error) {

        setErro(error.message);
        setCarregando(false);

        return;

      }

      await gerarRelatorio(FILTROS_INICIAIS);

    }

    iniciar();

  }, []);


  function handleChange(e) {

    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });

  }


  function handleSubmit(e) {

    e.preventDefault();

    gerarRelatorio();

  }


  function limparFiltros() {

    const novos = { ...FILTROS_INICIAIS };

    setFiltros(novos);

    gerarRelatorio(novos);

  }


  function formatarData(data) {

    if (!data) return "-";

    const valor = new Date(
      data.replace(" ", "T") + "Z"
    );

    return Number.isNaN(valor.getTime())
      ? data
      : valor.toLocaleString("pt-BR");

  }


  function prioridadeQuantidade(prioridade) {

    return dados?.prioridades?.find(
      (p) => p.prioridade === prioridade
    )?.quantidade || 0;

  }


  function exportarCSV() {

    if (!dados) return;

    function escapar(valor) {

      let texto = String(valor ?? "");

      // Evitar fórmulas em planilhas

      if (/^[\s]*[=+\-@]/.test(texto)
        || /^[\t\r\n]/.test(texto)) {

        texto = "'" + texto;

      }

      return `"${texto.replace(/"/g, '""')}"`;

    }

    const linhas = [

      [
        "ID",
        "Cliente",
        "Técnico",
        "Descrição",
        "Prioridade",
        "Status",
        "Abertura",
        "Encerramento"
      ],

      ...dados.chamados.map((c) => [

        c.id,
        c.cliente_nome,
        c.tecnico_nome,
        c.descricao,
        c.prioridade,
        c.status,
        formatarData(c.data_abertura),
        formatarData(c.data_encerramento)

      ])

    ];

    const conteudo = linhas.map(

      linha => linha.map(escapar).join(";")

    ).join("\r\n");

    const arquivo = new Blob(
      ["\uFEFF", conteudo],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(arquivo);

    const link = document.createElement("a");

    link.href = url;
    link.download = "relatorio-helpdesk-isp.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

  }


  function exportarPDF() {

    window.print();

  }


  return (

    <div className="relatorio-pagina">

      <style>{`
        @media print {

          .topbar,
          .no-print {
            display: none !important;
          }

          body {
            background: white !important;
          }

          .page-content {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
          }

          .relatorio-pagina .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }

          .relatorio-pagina table {
            width: 100% !important;
            font-size: 10px !important;
          }

          .relatorio-pagina tr {
            break-inside: avoid;
          }

          .relatorio-pagina thead {
            display: table-header-group;
          }

          .relatorio-pagina th,
          .relatorio-pagina td {
            white-space: normal !important;
            overflow-wrap: anywhere;
          }

          .relatorio-pagina .tabela-relatorio {
            overflow: visible !important;
          }

          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          @page {
            size: A4 landscape;
            margin: 12mm;
          }

        }
      `}</style>


      <div className="page-header">

        <h1>Relatórios</h1>

        <p>
          Estatísticas e desempenho dos atendimentos técnicos.
        </p>

      </div>


      <div
        className="card no-print"
        style={{ marginBottom: 24 }}
      >

        <h2 style={{ marginBottom: 20 }}>
          Filtros do relatório
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label>Data inicial</label>

              <input
                type="date"
                name="data_inicio"
                value={filtros.data_inicio}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>Data final</label>

              <input
                type="date"
                name="data_fim"
                value={filtros.data_fim}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>Técnico</label>

              <select
                name="tecnico_id"
                value={filtros.tecnico_id}
                onChange={handleChange}
              >

                <option value="">Todos</option>

                {tecnicos.map((t) => (

                  <option key={t.id} value={t.id}>

                    {t.nome}

                  </option>

                ))}

              </select>

            </div>


            <div className="form-group">

              <label>Status</label>

              <select
                name="status"
                value={filtros.status}
                onChange={handleChange}
              >

                <option value="">Todos</option>
                <option value="Aberto">Aberto</option>
                <option value="Em Andamento">
                  Em Andamento
                </option>
                <option value="Concluído">
                  Concluído
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>Prioridade</label>

              <select
                name="prioridade"
                value={filtros.prioridade}
                onChange={handleChange}
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
              type="submit"
              className="btn-primary"
              style={{ width: "auto" }}
              disabled={carregando}
            >

              {carregando
                ? "Gerando..."
                : "Gerar relatório"}

            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={limparFiltros}
              disabled={carregando}
            >

              Limpar filtros

            </button>

          </div>

        </form>

      </div>


      {erro && (

        <div className="error-msg">

          {erro}

        </div>

      )}


      {carregando ? (

        <div className="card">

          Carregando relatório...

        </div>

      ) : dados && !erro && (

        <>

          <div
            className="card"
            style={{ marginBottom: 24 }}
          >

            <h3>HelpDesk ISP — Relatório de atendimentos</h3>

            <p>
              Período: {aplicados.data_inicio || "Início"}
              {" até "}
              {aplicados.data_fim || "Hoje (sem limite final)"}
            </p>

            <p>
              Técnico: {
                tecnicos.find(
                  t => String(t.id) === String(aplicados.tecnico_id)
                )?.nome || "Todos"
              }
            </p>

            <p>
              Status: {aplicados.status || "Todos"}
            </p>

            <p>
              Prioridade: {aplicados.prioridade || "Todas"}
            </p>

            <div
              className="form-actions no-print"
              style={{ marginTop: 16 }}
            >

              <button
                className="btn-secondary"
                onClick={exportarCSV}
              >

                Exportar CSV

              </button>

              <button
                className="btn-secondary"
                onClick={exportarPDF}
              >

                Exportar PDF

              </button>

            </div>

          </div>


          <div style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 24
          }}>

            <Indicador
              titulo="Total de chamados"
              valor={dados.total}
              cor="#2563eb"
            />

            <Indicador
              titulo="Chamados abertos"
              valor={dados.abertos}
              cor="#dc2626"
            />

            <Indicador
              titulo="Em andamento"
              valor={dados.em_andamento}
              cor="#d97706"
            />

            <Indicador
              titulo="Concluídos"
              valor={dados.concluidos}
              cor="#16a34a"
            />

            <Indicador
              titulo="Taxa de resolução"
              valor={`${dados.taxa_resolucao}%`}
              cor="#16a34a"
            />

            <Indicador
              titulo="Tempo médio de resolução"
              valor={
                dados.tempo_medio_horas == null
                  ? "-"
                  : `${dados.tempo_medio_horas.toLocaleString("pt-BR")} h`
              }
              cor="#7c3aed"
            />

          </div>


          <div style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 24
          }}>

            <div className="card">

              <h3 style={{ marginBottom: 20 }}>
                Distribuição por status
              </h3>

              <Barra
                titulo="Abertos"
                quantidade={dados.abertos}
                total={dados.total}
                cor="#dc2626"
              />

              <Barra
                titulo="Em andamento"
                quantidade={dados.em_andamento}
                total={dados.total}
                cor="#d97706"
              />

              <Barra
                titulo="Concluídos"
                quantidade={dados.concluidos}
                total={dados.total}
                cor="#16a34a"
              />

            </div>


            <div className="card">

              <h3 style={{ marginBottom: 20 }}>
                Distribuição por prioridade
              </h3>

              <Barra
                titulo="Alta"
                quantidade={prioridadeQuantidade("Alta")}
                total={dados.total}
                cor="#dc2626"
              />

              <Barra
                titulo="Média"
                quantidade={prioridadeQuantidade("Média")}
                total={dados.total}
                cor="#d97706"
              />

              <Barra
                titulo="Baixa"
                quantidade={prioridadeQuantidade("Baixa")}
                total={dados.total}
                cor="#16a34a"
              />

            </div>

          </div>


          <div
            className="card"
            style={{ marginBottom: 24 }}
          >

            <h3 style={{ marginBottom: 20 }}>

              Desempenho dos técnicos

            </h3>

            <div
              className="tabela-relatorio"
              style={{ overflowX: "auto" }}
            >

              <table>

                <thead>

                  <tr>
                    <th>Técnico</th>
                    <th>Total</th>
                    <th>Abertos</th>
                    <th>Em andamento</th>
                    <th>Concluídos</th>
                    <th>Resolução</th>
                  </tr>

                </thead>

                <tbody>

                  {dados.desempenho.map((t) => (

                    <tr key={t.tecnico_id ?? "sem-tecnico"}>

                      <td>{t.tecnico}</td>
                      <td>{t.total}</td>
                      <td>{t.abertos}</td>
                      <td>{t.em_andamento}</td>
                      <td>{t.concluidos}</td>
                      <td>{t.taxa_resolucao}%</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {dados.desempenho.length === 0 && (

              <div className="empty-state">

                Nenhum resultado encontrado.

              </div>

            )}

          </div>


          <div className="card">

            <h3 style={{ marginBottom: 20 }}>

              Chamados do relatório: {dados.total}

            </h3>

            <div
              className="tabela-relatorio"
              style={{ overflowX: "auto" }}
            >

              <table>

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Técnico</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                    <th>Abertura</th>
                    <th>Encerramento</th>
                  </tr>

                </thead>

                <tbody>

                  {dados.chamados.map((c) => (

                    <tr key={c.id}>

                      <td>#{c.id}</td>
                      <td>{c.cliente_nome}</td>
                      <td>{c.tecnico_nome}</td>
                      <td>{c.prioridade}</td>
                      <td>{c.status}</td>
                      <td>{formatarData(c.data_abertura)}</td>
                      <td>{formatarData(c.data_encerramento)}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {dados.chamados.length === 0 && (

              <div className="empty-state">

                Nenhum chamado encontrado.

              </div>

            )}

          </div>

        </>

      )}

    </div>

  );

}
