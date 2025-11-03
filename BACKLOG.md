# Backlog de Pendências / Melhorias Futuras

Este arquivo reúne tarefas que foram identificadas durante o desenvolvimento e que podem ser executadas depois. Cada grupo tem sugestões de prioridade.

## 🔐 Autenticação & Segurança
- [ ] Mover emissão de cookie JWT para o backend (httpOnly, Secure, SameSite=Strict).
- [ ] Validar expiração (`exp`) do token no frontend e realizar logout automático.
- [ ] Implementar fluxo de refresh token (novo campo + tabela ou denylist estendida).
- [ ] Adicionar revogação real no logout (mutation que adiciona o token à denylist).
- [ ] Rate limiting básico para login (Rack Attack ou gem similar).
- [ ] Remover armazenamento em `localStorage` (usar somente cookie seguro).
- [ ] Implementar política de complexidade de senha e tentativa de login limitada.
- [ ] Ativar opção Devise confirmable (e-mail de confirmação) se desejado.

## 👤 Usuários / Administração
- [ ] Criar tela de registro (mutation `registerUser`) acessível somente autenticado.
- [ ] Tela de listagem de usuários (restrita a admin) com ordenação e filtros.
- [ ] Função para atualizar senha do usuário autenticado.
- [ ] Função para reset de senha via e-mail (Devise recoverable).
- [ ] Gerenciamento de papéis (roles): ex: `admin`, `profissional`, `assistente`.
- [ ] Auditoria de ações sensíveis (quem criou paciente, etc.).

## 🗂️ Pacientes / Domínio
- [ ] Adicionar paginação na lista de pacientes (GraphQL connections ou argumentos `page`, `perPage`).
- [ ] Campo de busca textual (nome/email) com índice apropriado no banco.
- [ ] Soft delete com registro de quem deletou e motivo.
- [ ] Validações adicionais (ex: formato de CPF, datas, etc.).
- [ ] Exportação CSV/Excel controlada.

## 🚀 Frontend (UX / Performance)
- [ ] Exibir indicador global de loading (spinner top-level) durante autenticação.
- [ ] Persistir usuário em cache Apollo para evitar requisição `currentUser` duplicada.
- [ ] Adicionar tratamento de erros globais (ErrorBoundary + toast notifications).
- [ ] Refatorar para usar suspense/streaming em páginas server components onde possível.
- [ ] Implementar tema claro/escuro.
- [ ] Adicionar animações leves (ex: framer-motion) em transições.

## 🧪 Testes
- [ ] Backend: adicionar testes para mutations (`loginUser`, `registerUser`, pacientes CRUD).
- [ ] Backend: teste de revogação JWT e denial list.
- [ ] Frontend: testes de componente `LoginForm` (ex: React Testing Library).
- [ ] Frontend: testes do `AuthContext` (mock Apollo Client).
- [ ] Testes end-to-end (Playwright ou Cypress) para fluxo login -> home -> logout.

## 🛠 Arquitetura / Código
- [ ] Separar lógica de autenticação JWT do `ApplicationController` em service.
- [ ] Adicionar linters (Rubocop, ESLint com regras estritas). 
- [ ] Configurar Prettier para padronização de código TS/JS.
- [ ] Introduzir DTOs ou tipos mais fortes para respostas GraphQL no frontend.
- [ ] Extração de queries/mutations para camadas de serviço frontend.

## 📦 Infra / Deploy
- [ ] Dockerizar frontend (já existe backend e compose parcial, criar serviço web). 
- [ ] Adicionar arquivo `.env.example` consolidando variáveis (JWT secret, etc.).
- [ ] Configurar ambiente staging (banco separado e seeds customizados).
- [ ] Monitoramento e logging estruturado (Lograge + Sentry + Grafana/Prometheus).
- [ ] Healthcheck GraphQL custom (`query { health }`).

## 📄 Documentação
- [ ] Documentar todas mutations e queries (ex: gerar schema docs automática).
- [ ] Adicionar guia de contribuição (CONTRIBUTING.md).
- [ ] README backend: explicar fluxo JWT, revogação, e endpoints GraphQL principais.
- [ ] Guia de segurança (como rotacionar segredo JWT, gestão de admin inicial).

## 🔄 Qualidade de Vida Dev
- [ ] Script `bin/dev` para subir tudo (backend + frontend + docker compose).
- [ ] Hot reload otimizado no backend (Spring / bootsnap ajustes).
- [ ] Task Rake para recriar dados de desenvolvimento (`rake dev:reset`).

## 🧩 Melhorias Técnicas Futuras
- [ ] Migrar mutations para usar `input` pattern se quiser compatibilidade Relay.
- [ ] Implementar DataLoader para evitar N+1 em queries complexas.
- [ ] Cache GraphQL (ex: Redis) para queries comuns.
- [ ] Circuit breaker / retry em chamadas externas (se integrar serviços).

## 🗃 Prioridades Sugestivas
1. Segurança básica (cookies httpOnly, expiração token, revogação real). 
2. Testes críticos (login, registro, pacientes). 
3. UX do login (feedback, erros, loading global). 
4. Documentação e `.env.example`. 
5. Paginação e busca em pacientes. 
6. Refresh token / roles avançados.

---
Adicione novas entradas conforme surgirem necessidades. Marque concluídas com `[x]` e mova tarefas grandes para issues individuais.