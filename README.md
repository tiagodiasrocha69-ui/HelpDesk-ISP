# HelpDesk ISP — Front-End

Front-end do sistema HelpDesk ISP (Projeto Integrador), desenvolvido com **React** e **Vite**.

## Tecnologias utilizadas

- **React 19** — biblioteca para construção da interface.
- **Vite** — build tool e servidor de desenvolvimento.
- **React Router DOM** — roteamento entre páginas e proteção de rotas por perfil de usuário.
- **CSS puro** — estilização (sem framework de UI, para manter o bundle leve).

## Funcionalidades implementadas (Sprint 1)

- **Login e logout de usuários** (`src/pages/Login.jsx`)
- **Controle de acesso por perfil** — administrador, atendente e técnico (`src/components/ProtectedRoute.jsx`)
- **Cadastro de clientes** — criar, editar e excluir (`src/pages/CadastroClientes.jsx`)
- **Cadastro de técnicos** (`src/pages/CadastroTecnicos.jsx`)
- **Abertura de chamado técnico** (`src/pages/AberturaChamado.jsx`)

> Os dados são mantidos em memória (mock) nesta etapa. A integração com o back-end/API será feita em uma sprint futura.

## Como rodar o projeto

```bash
npm install
npm run dev
```

Acesse http://localhost:5173

### Usuários de demonstração

| Login      | Senha  | Perfil         |
|------------|--------|----------------|
| atendente  | 123456 | Atendente      |
| tecnico    | 123456 | Técnico        |
| admin      | 123456 | Administrador  |

## Estrutura do projeto

```
src/
├── components/       # Layout e componente de rota protegida
├── context/          # Contexto de autenticação
├── pages/            # Páginas (Login, Dashboard, Clientes, Técnicos, Chamados)
├── App.jsx           # Definição das rotas
└── main.jsx          # Ponto de entrada da aplicação
```
