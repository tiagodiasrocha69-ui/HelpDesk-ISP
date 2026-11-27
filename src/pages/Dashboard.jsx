
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardApi } from "../api";


function Indicador({ titulo, valor, cor }) {

  return (

    <div className="card">

      <p style={{
        color: "#64748b",
        fontSize: 14,
        marginBottom: 12
      }}>

        {titulo}

      </p>

      <h2 style={{
        color: cor,
        fontSize: 32,
        margin: 0
      }}>

        {valor ?? 0}

      </h2>

    </div>

  );

}


function Barra({ titulo, valor, total, cor }) {

  const percentual = total > 0
    ? (valor / total) * 100
    : 0;

  return (

    <div style={{ marginBottom: 18 }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8
      }}>

        <span>{titulo}</span>

        <strong>{valor}</strong>

      </div>

      <div style={{
        height: 12,
        background: "#e5e7eb",
        borderRadius: 6,
        overflow: "hidden"
      }}>

        <div style={{
          width: `${percentual}%`,
          height: "100%",
          background: cor,
          borderRadius: 6
        }} />

      </div>

    </div>

  );

}


export default function Dashboard() {

  const { user } = useAuth();

  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);


  async function carregarDashboard() {

    setCarregando(true);
    setErro("");

    try {

      const resposta = await dashboardApi.consultar();

      setDados(resposta);

    } catch (error) {

      setErro(error.message);

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    carregarDashboard();

  }, []);


  function formatarData(data) {

    if (!data) return "-";

    const valor = new Date(
      data.replace(" ", "T") + "Z"
    );

    return Number.isNaN(valor.getTime())
      ? data
      : valor.toLocaleString("pt-BR");

  }


  function quantidadePrioridade(prioridade) {

    const registro = dados?.prioridades?.find(
      (p) => p.prioridade === prioridade
    );

    return registro?.quantidade || 0;

  }


  return (

    <div>

      <div className="page-header">

        <h1>Olá, {user?.nome}</h1>

        <p>
          {user?.perfil === "tecnico"
            ? "Acompanhe seus atendimentos técnicos."
            : "Visão geral do HelpDesk ISP."}
        </p>

      </div>


      <div className="form-actions"
        style={{ marginBottom: 24 }}>

        <button
          className="btn-secondary"
          onClick={carregarDashboard}
          disabled={carregando}
        >

          {carregando
            ? "Atualizando..."
            : "Atualizar indicadores"}

        </button>

      </div>


      {erro && (

        <div className="error-msg">

          {erro}

        </div>

      )}


      {carregando ? (

        <div className="card">

          Carregando indicadores...

        </div>

      ) : dados && (erro === "") && (

        <>

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


            {user?.perfil !== "tecnico" && (

              <>

                <Indicador
                  titulo="Clientes cadastrados"
                  valor={dados.total_clientes}
                  cor="#7c3aed"
                />

                <Indicador
                  titulo="Técnicos cadastrados"
                  valor={dados.total_tecnicos}
                  cor="#0891b2"
                />

                <Indicador
                  titulo="Técnicos disponíveis"
                  valor={dados.tecnicos_disponiveis}
                  cor="#16a34a"
                />

              </>

            )}

          </div>


          <div style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 24
          }}>

            <div className="card">

              <h2 style={{
                fontSize: 16,
                marginBottom: 24
              }}>
                Distribuição por status
              </h2>

              <Barra
                titulo="Abertos"
                valor={dados.abertos}
                total={dados.total}
                cor="#dc2626"
              />

              <Barra
                titulo="Em andamento"
                valor={dados.em_andamento}
                total={dados.total}
                cor="#d97706"
              />

              <Barra
                titulo="Concluídos"
                valor={dados.concluidos}
                total={dados.total}
                cor="#16a34a"
              />

            </div>


            <div className="card">

              <h2 style={{
                fontSize: 16,
                marginBottom: 24
              }}>
                Distribuição por prioridade
              </h2>

              <Barra
                titulo="Alta"
                valor={quantidadePrioridade("Alta")}
                total={dados.total}
                cor="#dc2626"
              />

              <Barra
                titulo="Média"
                valor={quantidadePrioridade("Média")}
                total={dados.total}
                cor="#d97706"
              />

              <Barra
                titulo="Baixa"
                valor={quantidadePrioridade("Baixa")}
                total={dados.total}
                cor="#16a34a"
              />

            </div>

          </div>


          <div
            className="card"
            style={{ marginBottom: 24 }}
          >

            <h2 style={{ fontSize: 16 }}>
              Taxa de resolução
            </h2>

            <h2 style={{
              fontSize: 36,
              color: "#16a34a",
              margin: "16px 0"
            }}>

              {dados.taxa_resolucao}%

            </h2>

            <Barra
              titulo="Chamados concluídos"
              valor={dados.concluidos}
              total={dados.total}
              cor="#16a34a"
            />

          </div>


          <div
            className="card"
            style={{ marginBottom: 24 }}
          >

            <h2 style={{
              fontSize: 16,
              marginBottom: 20
            }}>
              Chamados recentes
            </h2>


            {dados.recentes.length === 0 ? (

              <div className="empty-state">

                Nenhum chamado registrado.

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
                      <th>Data</th>

                    </tr>

                  </thead>

                  <tbody>

                    {dados.recentes.map((c) => (

                      <tr key={c.id}>

                        <td>#{c.id}</td>

                        <td>{c.cliente_nome}</td>

                        <td>
                          {c.tecnico_nome || "Não atribuído"}
                        </td>

                        <td>{c.prioridade}</td>

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

            <div style={{ marginTop: 20 }}>

              <Link
                to="/chamados"
                className="btn-secondary"
              >

                Ver todos os chamados

              </Link>

            </div>

          </div>

        </>

      )}

    </div>

  );

}
