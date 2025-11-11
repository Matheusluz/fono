# 🏥 Sistema de Gestão de Clínica (Fono / Psicologia)

Sistema completo para gestão de clínicas de fonoaudiologia e psicologia com agendamento, prontuário eletrônico, controle financeiro e relatórios.

> 🪟 **Windows/WSL 2**: Se estiver no Windows, veja primeiro o [guia de setup WSL 2](WSL2_SETUP.md) para configurar o Docker corretamente.

## 🚀 Início Rápido

### Pré-requisitos
- Docker & Docker Compose
- Ruby 3.x
- Node.js 18+
- PostgreSQL cliente (opcional, para acesso direto ao banco)

> 🐧 **Usando Windows/WSL 2?** Veja o guia completo em [WSL2_SETUP.md](WSL2_SETUP.md)

### Instalação e Execução

#### Opção 1: Script Unificado (Recomendado)
```bash
# Iniciar todo o ambiente (Docker + Backend + Frontend)
./bin/dev
```

O script irá:
1. ✅ Verificar dependências
2. ✅ Iniciar containers Docker (PostgreSQL + Redis)
3. ✅ Criar banco de dados e rodar migrations
4. ✅ Instalar dependências (gems + npm)
5. ✅ Iniciar Backend Rails (porta 3001)
6. ✅ Iniciar Frontend Next.js (porta 4000)

#### Opção 2: Manual (Passo a Passo)
```bash
# 1. Subir containers
docker-compose up -d

# 2. Backend
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3001

# 3. Frontend (em outro terminal)
cd frontend
npm install
PORT=4000 npm run dev
```

### Parar Todos os Serviços
```bash
./bin/stop
```

## 📍 Acesso

- **Frontend**: http://localhost:4000
- **Backend (GraphQL)**: http://localhost:3001/graphql
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6380

### Credenciais Padrão
```
Email: admin@fono.com
Senha: admin123456
```

## 🗂 Estrutura do Projeto

```
fono/
├── backend/          # API Rails + GraphQL
│   ├── app/
│   │   ├── graphql/  # Mutations, Queries, Types
│   │   ├── models/   # User, Patient, Current
│   │   └── ...
│   ├── config/
│   └── db/
├── frontend/         # Next.js 14 (App Router)
│   ├── src/
│   │   ├── app/      # Páginas (login, users, patients)
│   │   ├── components/
│   │   └── lib/      # Apollo Client, GraphQL
│   └── ...
├── bin/
│   ├── dev           # Script unificado de desenvolvimento
│   └── stop          # Script para parar serviços
├── logs/             # Logs do backend e frontend
├── docker-compose.yml
└── BACKLOG.md        # Roadmap de funcionalidades
```

## 🔧 Comandos Úteis

### Backend
```bash
cd backend

# Console Rails
bundle exec rails console

# Rodar migrations
bundle exec rails db:migrate

# Resetar banco (CUIDADO: apaga tudo)
bundle exec rails db:reset

# Rodar testes
bundle exec rspec

# Ver rotas GraphQL
bundle exec rails routes | grep graphql
```

### Frontend
```bash
cd frontend

# Build de produção
npm run build

# Lint
npm run lint

# Limpar cache
rm -rf .next
```

### Docker
```bash
# Ver logs dos containers
docker-compose logs -f

# Acessar PostgreSQL
docker-compose exec postgres psql -U postgres -d fono_development

# Resetar tudo (CUIDADO: apaga volumes)
docker-compose down -v
```

## 📊 Status do Projeto

### ✅ Implementado
- Autenticação JWT com Devise
- CRUD de Usuários (admin)
- CRUD de Pacientes (soft delete)
- Dashboard inicial
- Contexto global de usuário (`Current.user`)
- Proteção de rotas GraphQL

### 🚧 Em Desenvolvimento (ver BACKLOG.md)
- Agenda e consultas
- Prontuário eletrônico
- Controle financeiro
- Relatórios e métricas
- Notificações automáticas
- Integração convênios

## 🔐 Segurança

- JWT com expiração de 24h
- Soft delete em registros sensíveis
- Validação de autenticação em todas mutations/queries
- Proteção contra auto-exclusão de usuários
- Conformidade LGPD (em progresso)

## 📚 Documentação Adicional

- [BACKLOG.md](BACKLOG.md) - Roadmap completo e funcionalidades planejadas
- [backend/AUTHENTICATION.md](backend/AUTHENTICATION.md) - Sistema de autenticação
- [backend/REFACTORING.md](backend/REFACTORING.md) - Histórico de refatorações

## 🐛 Troubleshooting

### PostgreSQL não conecta
```bash
# Verificar se container está rodando
docker-compose ps

# Ver logs
docker-compose logs postgres

# Reiniciar container
docker-compose restart postgres
```

### Frontend não carrega
```bash
# Limpar cache e reinstalar
cd frontend
rm -rf .next node_modules
npm install
PORT=4000 npm run dev
```

### Backend com erro de gems
```bash
cd backend
rm -rf vendor/bundle
bundle install
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para profissionais da saúde**
