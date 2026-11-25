
const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:5000/api";


export async function api(endpoint, opcoes = {}) {

    let resposta;

    try {

        resposta = await fetch(`${API_URL}${endpoint}`, {
            ...opcoes,

            credentials: "include",

            headers: {
                "Content-Type": "application/json",
                ...opcoes.headers
            }
        });

    } catch {

        throw new Error(
            "Não foi possível conectar ao servidor."
        );

    }

    const dados = await resposta.json().catch(() => null);

    if (!resposta.ok) {

        const erro = new Error(
            dados?.erro ||
            "Erro ao realizar a operação."
        );

        erro.status = resposta.status;

        throw erro;

    }

    return dados;
}


// AUTENTICAÇÃO

export const autenticacaoApi = {

    login: (login, senha) =>
        api("/login", {
            method: "POST",
            body: JSON.stringify({ login, senha })
        }),

    logout: () =>
        api("/logout", {
            method: "POST"
        }),

    usuarioAtual: () =>
        api("/me")
};


// CLIENTES

export const clientesApi = {

    listar: () =>
        api("/clientes"),

    consultar: (id) =>
        api(`/clientes/${id}`),

    cadastrar: (dados) =>
        api("/clientes", {
            method: "POST",
            body: JSON.stringify(dados)
        }),

    editar: (id, dados) =>
        api(`/clientes/${id}`, {
            method: "PUT",
            body: JSON.stringify(dados)
        }),

    excluir: (id) =>
        api(`/clientes/${id}`, {
            method: "DELETE"
        })
};


// TÉCNICOS

export const tecnicosApi = {

    listar: () =>
        api("/tecnicos"),

    consultar: (id) =>
        api(`/tecnicos/${id}`),

    cadastrar: (dados) =>
        api("/tecnicos", {
            method: "POST",
            body: JSON.stringify(dados)
        }),

    editar: (id, dados) =>
        api(`/tecnicos/${id}`, {
            method: "PUT",
            body: JSON.stringify(dados)
        }),

    excluir: (id) =>
        api(`/tecnicos/${id}`, {
            method: "DELETE"
        })
};


// CHAMADOS

export const chamadosApi = {

    listar: (filtros = {}) => {

        const parametros = new URLSearchParams(filtros);
        const consulta = parametros.toString();

        return api(
            `/chamados${consulta ? `?${consulta}` : ""}`
        );
    },

    consultar: (id) =>
        api(`/chamados/${id}`),

    cadastrar: (dados) =>
        api("/chamados", {
            method: "POST",
            body: JSON.stringify(dados)
        })
};
