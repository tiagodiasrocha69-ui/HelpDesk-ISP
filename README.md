
# HelpDesk ISP — Frontend

## Projeto Integrador II

Universidade Estadual do Piauí — UESPI
Universidade Aberta do Piauí — UAPI
Curso: Tecnologia em Sistemas para Internet

Versão: 1.0.0

## Sobre o projeto

O HelpDesk ISP é um sistema web de gerenciamento
de chamados técnicos voltado para provedores
de serviços de internet.

A aplicação permite centralizar o cadastro de
clientes, técnicos e usuários, acompanhar os
atendimentos e consultar indicadores e relatórios.

Este repositório contém o frontend da aplicação,
responsável pela interface e pela comunicação
com a API REST desenvolvida em Flask.

## Objetivos

- Facilitar o gerenciamento de atendimentos técnicos.
- Centralizar informações operacionais.
- Organizar a distribuição de chamados.
- Acompanhar o andamento dos atendimentos.
- Melhorar o controle das atividades dos técnicos.
- Auxiliar a tomada de decisões.
- Disponibilizar indicadores e relatórios gerenciais.

## Tecnologias utilizadas

- React
- JavaScript
- HTML5
- CSS3
- Vite
- React Router DOM
- Context API
- Fetch API
- API REST
- Git e GitHub

## Arquitetura do sistema

O sistema utiliza uma arquitetura cliente-servidor,
com separação entre frontend e backend.

Frontend: React e Vite

Comunicação: HTTP e JSON

Backend: Python e Flask

Banco de dados: SQLite

O frontend realiza requisições à API REST,
que processa as regras de negócio e executa
as operações no banco de dados.

## Funcionalidades

### Autenticação

- Tela de login.
- Validação de credenciais.
- Persistência da sessão.
- Logout.
- Proteção de rotas.
- Controle de acesso por perfil.

### Dashboard

- Total de chamados.
- Chamados abertos.
- Chamados em andamento.
- Chamados concluídos.
- Total de clientes.
- Total de técnicos.
- Técnicos disponíveis.
- Taxa de resolução.
- Distribuição por status.
- Distribuição por prioridade.
- Chamados recentes.

### Gerenciamento de clientes

- Cadastro de clientes.
- Listagem de clientes.
- Busca de registros.
- Edição de informações.
- Exclusão de clientes sem chamados vinculados.

### Gerenciamento de técnicos

- Cadastro de técnicos.
- Criação de credenciais de acesso.
- Listagem de técnicos.
- Edição de informações.
- Controle de disponibilidade.

### Chamados técnicos

- Abertura de chamados.
- Seleção do cliente.
- Preenchimento do endereço.
- Descrição do problema.
- Definição de prioridade.
- Listagem de chamados.
- Busca e filtros.
- Atribuição manual de técnicos.
- Início do atendimento.
- Encerramento do chamado.
- Registro da solução.
- Histórico de movimentações.

### Gerenciamento de usuários

- Cadastro de usuários.
- Listagem de contas.
- Busca por nome, login ou perfil.
- Edição de informações.
- Controle de permissões.
- Ativação e desativação de contas.
- Redefinição de senhas.

### Relatórios

- Filtro por período.
- Filtro por técnico.
- Filtro por status.
- Filtro por prioridade.
- Indicadores de atendimento.
- Taxa de resolução.
- Tempo médio de resolução.
- Desempenho dos técnicos.
- Listagem detalhada dos chamados.
- Exportação em CSV.
- Exportação em PDF pelo navegador.

## Perfis de acesso

| Funcionalidade | Administrador | Atendente | Técnico | Gerente |
|---|---|---|---|---|
| Dashboard | Sim | Sim | Sim | Sim |
| Cadastro de clientes | Sim | Sim | Não | Não |
| Gerenciamento de técnicos | Sim | Não | Não | Não |
| Abertura de chamados | Sim | Sim | Não | Não |
| Consulta de chamados | Sim | Sim | Próprios | Sim |
| Atribuição de técnicos | Sim | Sim | Não | Não |
| Início do atendimento | Sim | Não | Próprios | Não |
| Encerramento de chamados | Sim | Não | Próprios | Não |
| Histórico | Sim | Sim | Próprios | Sim |
| Gerenciamento de usuários | Sim | Não | Não | Não |
| Relatórios | Sim | Sim | Não | Sim |

## Estrutura principal do projeto

```text
helpdesk-isp-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CadastroClientes.jsx
│   │   ├── CadastroTecnicos.jsx
│   │   ├── AberturaChamado.jsx
│   │   ├── ListaChamados.jsx
│   │   ├── GerenciamentoUsuarios.jsx
│   │   └── Relatorios.jsx
│   ├── api.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## Requisitos para execução

- Node.js compatível com a versão do Vite.
- npm.
- Git.
- Backend HelpDesk ISP em execução.
- Navegador web atualizado.

## Instalação e execução

### 1. Clonar o repositório

```powershell
git clone https://github.com/tiagodiasrocha69-ui/HelpDesk-ISP.git helpdesk-isp-frontend
```

### 2. Acessar a pasta

```powershell
cd helpdesk-isp-frontend
```

### 3. Instalar as dependências

```powershell
npm ci
```

### 4. Iniciar o backend

O backend deve estar em execução antes
da utilização das funcionalidades do sistema.

Repositório:

https://github.com/tiagodiasrocha69-ui/helpdesk-isp-backend

Endereço padrão da API:

http://127.0.0.1:5000/api

Consulte o README do backend para realizar
a instalação e configurar a conta administrativa.

### 5. Iniciar o frontend

```powershell
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

### 6. Acessar o sistema

http://127.0.0.1:5173/HelpDesk-ISP/

O sistema utiliza autenticação real.

As credenciais devem corresponder aos usuários
cadastrados no banco de dados do backend.

## Configuração da API

O arquivo src/api.js centraliza as requisições
realizadas pelo frontend.

O endereço padrão da API é:

http://127.0.0.1:5000/api

É possível configurar outro endereço por meio
da variável de ambiente VITE_API_URL.

As requisições utilizam credenciais de sessão
para autenticação junto ao backend.

## Fluxo de atendimento

1. O administrador ou atendente realiza o login.
2. O cliente é cadastrado no sistema.
3. Um chamado técnico é aberto.
4. Um técnico é atribuído ao chamado.
5. O técnico acessa sua conta.
6. O atendimento é iniciado.
7. A solução do problema é registrada.
8. O chamado é concluído.
9. O histórico é atualizado.
10. Os indicadores e relatórios são consultados.

## Compilação de produção

Para gerar os arquivos compilados:

```powershell
npm run build
```

Os arquivos serão gerados na pasta dist.

A compilação não disponibiliza automaticamente
o backend nem configura a hospedagem pública.

## Auditoria de dependências

```powershell
npm audit
```

Na validação realizada em 27/11/2026,
o npm não apresentou vulnerabilidades conhecidas.

## Testes realizados

- Autenticação.
- Login e logout.
- Persistência da sessão.
- Proteção de rotas.
- Controle de acesso por perfil.
- Cadastro de clientes.
- Cadastro de técnicos.
- Abertura de chamados.
- Atribuição de técnicos.
- Atualização de status.
- Encerramento de chamados.
- Histórico de movimentações.
- Dashboard com dados reais.
- Gerenciamento de usuários.
- Redefinição de senhas.
- Relatórios e filtros.
- Exportação CSV.
- Exportação PDF.
- Compilação de produção.
- Auditoria das dependências npm.

## Resultados da validação

- Compilação do frontend concluída sem erros.
- 35 módulos processados pelo Vite.
- Nenhuma vulnerabilidade npm conhecida
  na data da auditoria.
- Integração funcional entre React, Flask e SQLite.

## Segurança

O frontend utiliza proteção de rotas,
controle de menus por perfil e autenticação
integrada ao backend.

As permissões também são verificadas pela API,
não dependendo exclusivamente da interface.

As senhas não são armazenadas no frontend.

A configuração atual é destinada à execução
local e à apresentação acadêmica.

A implantação pública exige configurações
adicionais de hospedagem e segurança.

## Metodologia de desenvolvimento

O projeto foi desenvolvido de forma incremental,
com implementação e validação das funcionalidades
organizadas em etapas.

Ferramentas de gerenciamento:

- Git.
- GitHub.
- Trello.

## Repositórios do projeto

### Frontend

https://github.com/tiagodiasrocha69-ui/HelpDesk-ISP

### Backend

https://github.com/tiagodiasrocha69-ui/helpdesk-isp-backend

## Status do projeto

Versão funcional 1.0.0.

Desenvolvida para a disciplina Projeto Integrador II,
com integração entre interface, API REST e
banco de dados.

## Finalidade acadêmica

Projeto desenvolvido para fins acadêmicos
no curso de Tecnologia em Sistemas para Internet
da UESPI/UAPI.
