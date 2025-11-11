# Backlog Geral do Sistema de Gestão de Clínica (Fono / Psicologia)

Este arquivo consolida funcionalidades existentes, pendências e roadmap evolutivo. Estruturado por épicos, priorização por fases e tarefas técnicas de sustentação.

## ✅ Já Implementado (Baseline)
- [x] Autenticação JWT básica (login / registro / require_authentication!)
- [x] Contexto de usuário com `Current.user`
- [x] CRUD de Usuários (listar, criar, editar, deletar) com proteção de auto-exclusão
- [x] CRUD de Pacientes (listar, criar, editar, deletar soft) + cálculo de idade
- [x] Soft delete de Pacientes (paranoia)
- [x] Indicação visual de campos obrigatórios nos formulários
- [x] Sistema de roles (admin, professional, assistant) com enum
- [x] Tabela de Profissionais (professionals) linkada a users
- [x] CRUD completo de Profissionais (backend + frontend)
- [x] Validação de token expirado com auto-logout
- [x] ErrorBoundary para captura de erros de autenticação

## 🧭 Visão: Plataforma completa de apoio a profissionais (agendamento, evolução clínica, financeiro, relatórios e comunicação) com conformidade LGPD.

---
## 📌 Épicos Funcionais

### 1. 📅 Agenda & Consultas
- [ ] Calendário por profissional (dia / semana / mês)
- [ ] Marcar consulta (paciente + profissional + data/hora + duração)
- [ ] Status: agendada / confirmada / realizada / cancelada / falta
- [ ] Recorrência (gerar sessões semanais/quinzenais)
- [ ] Lista de espera por horário ou profissional
- [ ] Bloqueio de horários (férias, ausência, eventos)
- [ ] Overbooking controlado (regra padrão impedir)
- [ ] Integração opcional Google Calendar (sync push/pull)

### 2. 📋 Prontuário Eletrônico
- [ ] Anamnese estruturada (campos configuráveis)
- [ ] Evolução por sessão (texto rico + anexos)
- [ ] Plano terapêutico (objetivos, metas, revisões periódicas)
- [ ] Protocolos / Avaliações padronizadas (ex: testes específicos de fono)
- [ ] Upload de arquivos (exames, laudos) com controle de acesso
- [ ] Laudos gerados em PDF (template parametrizável)
- [ ] Histórico de alterações (versionamento simples de notas)
- [ ] Assinatura digital (hash + carimbo de tempo) futura

### 3. 💰 Financeiro
- [ ] Registro de pagamento por sessão
- [ ] Venda de pacotes (X sessões com desconto)
- [ ] Geração de recibo / nota (PDF)
- [ ] Métodos de pagamento: cartão / PIX / dinheiro / transferência
- [ ] Conciliação básica (status: pendente / pago / parcial / inadimplente)
- [ ] Relatório de faturamento por período / profissional
- [ ] Integração com convênios (autorização / código de procedimento)
- [ ] Projeção de receita (próximas sessões agendadas)

### 4. 👥 Gestão de Profissionais
- [x] Perfis: admin / profissional / assistente (enum role)
- [x] Tabela professionals com especialidade, registro conselho, bio
- [x] CRUD completo de profissionais (backend + frontend)
- [x] Soft delete (campo active)
- [x] Listagem com filtro por especialidade
- [ ] Agenda individual com preferências (intervalos, duração padrão)
- [ ] Controle de férias / folgas
- [ ] Métricas de produtividade (atendimentos realizados / cancelamentos)
- [ ] Comissão sobre atendimentos (regra % por categoria)
- [ ] Criar opção para reativar o profissional
- [ ] Perfil público resumido (especialidades) opcional

### 5. 📊 Relatórios & Métricas
- [ ] Dashboard inicial com KPIs (pacientes ativos, taxa ocupação agenda, receita mês)
- [ ] Relatório de cancelamentos / faltas
- [ ] Relatório de evolução terapêutica (tempo médio tratamento)
- [ ] Exportação CSV / XLS de relatórios
- [ ] Drill-down por profissional / especialidade

### 6. 🔔 Comunicação & Engajamento
- [ ] Lembrete automático de consulta (e-mail / SMS / WhatsApp*)
- [ ] Confirmação via link (atualiza status)
- [ ] Mensagens em massa (campanhas: reavaliação, retorno)
- [ ] Histórico de envio (log central)
- [ ] Termo de consentimento digital (assinatura paciente)
*WhatsApp depende de integração externa (Twilio / Meta API).

### 7. 🗂️ Pacientes (Expansões)
- [ ] Paginação e busca (nome / email / telefone)
- [ ] Etiquetas / categorias (ex: prioridade, convênio, tipo de terapia)
- [ ] Campos adicionais (CPF, responsável legal, endereço)
- [ ] Registro de motivo da exclusão (soft delete auditável)
- [ ] Restauração de paciente deletado (mutation restore)
- [ ] Exportação controlada (GDPR/LGPD – log de quem exportou)

### 8. 👤 Usuários / Administração
- [ ] Redefinição de senha (recoverable)
- [ ] Atualização de própria senha
- [ ] Gestão de roles + autorização por GraphQL policy layer
- [ ] Auditoria (quem criou / editou / deletou registros)
- [ ] Trilha de atividades (último login, ações críticas)

### 9. 🔐 Autenticação & Segurança
- [ ] Cookies httpOnly + Secure + SameSite=Strict
- [x] Validação automática de expiração (auto logout)
- [x] Limpeza automática de tokens inválidos
- [x] ErrorBoundary para capturar erros de autenticação
- [ ] Refresh token + rotação
- [ ] Revogação real (denylist mutation)
- [ ] Rate limiting login (Rack::Attack)
- [ ] Remover `localStorage` para token
- [ ] Políticas de senha (tamanho, entropia, histórico)
- [ ] Devise confirmable (opcional)
- [ ] LGPD: consentimento + direito de exclusão (hard delete sob requisição formal)

### 10. 🚀 Frontend (UX / Performance)
- [ ] Loading global / skeletons
- [ ] Cache de usuário persistente (Apollo + reactive var)
- [x] Tratamento de erros global (ErrorBoundary + auto logout em erros de auth)
- [ ] Tema claro/escuro
- [ ] Suspense / streaming quando possível
- [ ] Acessibilidade (labels, aria, contraste)
- [ ] Microinterações (framer-motion)

### 11. 🧪 Testes & Qualidade
- [ ] RSpec: mutations auth & pacientes
- [ ] RSpec: modelo User (JWT / self-delete prevention)
- [ ] Frontend: testes de formulário (React Testing Library)
- [ ] E2E: fluxo principal (login -> agendar -> evoluir -> pagamento)
- [ ] Contract tests GraphQL (snapshot schema)

### 12. 🛠 Arquitetura / Código
- [ ] Service objects para autenticação JWT
- [ ] Linters: Rubocop / ESLint estrito
- [ ] Prettier padronizado
- [ ] Tipagem forte de respostas GraphQL (codegen)
- [ ] Camada de policies (Pundit ou custom) para autorização fina
- [ ] Extração de lógica de presenters / serializers

### 13. 📦 Infra / Deploy
- [ ] Docker do frontend + compose integrado
- [x] `.env.example` consolidado (backend + frontend)
- [ ] Ambiente staging
- [ ] Observabilidade: Lograge + Sentry + métricas Prometheus
- [ ] Healthcheck GraphQL (`query { health }`)
- [ ] Backup automatizado banco + storage de anexos

### 14. 📄 Documentação
- [x] README.md principal com instruções de setup
- [x] DEVELOPMENT.md com guia técnico para devs
- [ ] Documentar queries/mutations (schema introspection -> docs)
- [ ] CONTRIBUTING.md
- [ ] Guia JWT (renovação / revogação / best practices)
- [ ] Guia LGPD (fluxo de consentimento e deleção)
- [ ] Changelog versão

### 15. 🔄 Qualidade de Vida Dev
- [x] Script `bin/dev` unificado
- [x] Script `bin/stop` para encerrar serviços
- [x] README.md com instruções de uso
- [x] Diretório de logs estruturado
- [ ] Hot reload otimizado backend
- [ ] Rake `dev:reset` (reset + seeds ricos)
- [ ] Seeds realistas (pacientes + usuários variados)

### 16. 🧩 Melhorias Técnicas Futuras
- [ ] Mutations com `input` object pattern
- [ ] DataLoader para evitar N+1
- [ ] Cache Redis para queries frequentes
- [ ] Retentativa / circuit breaker integrações externas
- [ ] Feature flags (Rollout / Flipper)

### 17. 🛡 Conformidade & Privacidade (LGPD)
- [ ] Mapa de dados pessoais (onde armazenado / finalidade)
- [ ] Log de acesso a prontuário
- [ ] Exportação de dados do paciente (portabilidade)
- [ ] Hard delete sob solicitação (procedimento formal)

---
## � Roadmap por Fases

### Fase 1 – Essencial (MVP Operacional)
1. Agenda básica (marcar / listar consultas)
2. Prontuário mínimo (anamnese + evolução simples)
3. Pagamentos por sessão (registro manual)
4. Paginação + busca pacientes
5. Segurança JWT (cookies httpOnly + revogação)
6. Testes críticos (auth + pacientes)

### Fase 2 – Expansão
1. Recorrência / lembretes automáticos
2. Plano terapêutico + anexos
3. Pacotes de sessões / recibos PDF
4. Dashboard de métricas
5. Roles avançadas + auditoria
6. Recuperação de senha / confirmable

### Fase 3 – Avançado
1. Integração convênios
2. Assinatura digital / laudos avançados
3. Integração Google Calendar / WhatsApp
4. Comissões / produtividade profissional
5. Exportação LGPD / portal do paciente
6. Mobile / PWA

---
## 🔍 Exemplos de User Stories
- Como profissional quero agendar uma consulta para visualizar rapidamente minha semana.
- Como recepcionista quero ver a lista de pacientes aguardando para organizar a ordem de atendimento.
- Como paciente quero receber um lembrete para não esquecer minha sessão.
- Como administrador quero ver o faturamento mensal para acompanhar crescimento.
- Como profissional quero registrar evolução terapêutica para manter histórico clínico.

---
## 🗃 Prioridades Transversais (Manter Sempre)
- Segurança / LGPD
- Qualidade de código (lint / testes)
- Observabilidade
- Documentação atualizada

---
Adicione novas entradas conforme surgirem necessidades. Marque concluídas com `[x]`. Para itens grandes, abrir issues individuais referenciando este arquivo.