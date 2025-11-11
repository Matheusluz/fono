# 🛠 Guia de Desenvolvimento

Este documento complementa o README.md com informações técnicas para desenvolvedores.

## 🏗 Arquitetura

### Stack Tecnológica
- **Backend**: Rails 7.1 + GraphQL (graphql-ruby)
- **Frontend**: Next.js 14 (App Router) + Apollo Client
- **Database**: PostgreSQL 15
- **Cache/Jobs**: Redis 7
- **Auth**: Devise + JWT (devise-jwt)
- **Soft Delete**: Paranoia gem

### Padrões de Código

#### Backend (Rails)
- **Models**: Business logic, validações, callbacks
- **Mutations**: Thin controllers, apenas orquestração
- **Queries**: Resolvers para lógica de busca complexa
- **Current**: Contexto global de usuário (`Current.user`)
- **Authentication**: `require_authentication!` em todas mutations/queries protegidas

#### Frontend (Next.js)
- **App Router**: Arquitetura server/client components
- **Apollo Client**: Cache e state management
- **Components**: Reutilizáveis e atômicos
- **GraphQL**: Operações centralizadas em `lib/graphql.ts`

## 🔄 Workflow de Desenvolvimento

### 1. Iniciar Ambiente
```bash
# Método rápido
./bin/dev

# Ou manual (3 terminais)
docker-compose up -d              # Terminal 1
cd backend && rails s -p 3001     # Terminal 2
cd frontend && PORT=4000 npm run dev  # Terminal 3
```

### 2. Criar Nova Funcionalidade

#### Backend: Nova Mutation
```bash
cd backend

# 1. Criar migration
rails g migration AddFieldToModel field:type

# 2. Rodar migration
rails db:migrate

# 3. Criar mutation
# app/graphql/mutations/my_mutation.rb
# Ver exemplos em mutations/update_user.rb

# 4. Registrar em types/mutation_type.rb
field :myMutation, mutation: Mutations::MyMutation

# 5. Testar no GraphiQL
# http://localhost:3001/graphql
```

#### Frontend: Novo Component/Page
```bash
cd frontend

# 1. Adicionar operação GraphQL em src/lib/graphql.ts
export const MY_MUTATION = gql`...`

# 2. Criar página em src/app/my-page/page.tsx
# Ver exemplo em src/app/users/page.tsx

# 3. Adicionar ao menu (se aplicável)
# Editar src/app/layout.tsx
```

### 3. Testar
```bash
# Backend
cd backend
bundle exec rspec

# Frontend
cd frontend
npm run lint
npm run build  # Verifica erros de tipo
```

### 4. Commit
```bash
git add .
git commit -m "feat: adiciona funcionalidade X"
```

## 📝 Convenções

### Commits (Conventional Commits)
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `refactor:` Refatoração sem mudar comportamento
- `docs:` Documentação
- `test:` Adiciona/corrige testes
- `chore:` Tarefas de manutenção

### Branches
- `main` - Produção
- `develop` - Desenvolvimento
- `feature/nome-da-feature` - Nova funcionalidade
- `fix/nome-do-bug` - Correção

### Nomenclatura

#### Backend
- Models: `PascalCase` (User, Patient)
- Mutations: `PascalCase` (CreatePatient, UpdateUser)
- Campos GraphQL: `camelCase` (firstName, createdAt)
- Métodos Ruby: `snake_case` (generate_jwt_token)

#### Frontend
- Components: `PascalCase.tsx` (FormInput, LoginForm)
- Páginas: `page.tsx` (dentro de diretório)
- Hooks: `useCamelCase` (useAuth, usePatients)
- Constantes GraphQL: `UPPER_SNAKE_CASE` (LOGIN_USER_MUTATION)

## 🔍 Debugging

### Backend
```bash
# Console Rails
cd backend
bundle exec rails console

# Testar métodos
> user = User.first
> user.generate_jwt_token
> Current.user = user

# Ver queries SQL
> ActiveRecord::Base.logger = Logger.new(STDOUT)
```

### Frontend
```bash
# Apollo Client DevTools
# Instalar extensão no Chrome/Firefox
# Inspecionar cache e queries

# Logs do Next.js
# Ver console do terminal onde rodou npm run dev
```

### GraphQL Playground
```
http://localhost:3001/graphql
```

Exemplo de query com autenticação:
```graphql
# 1. Login
mutation {
  loginUser(email: "admin@fono.com", password: "admin123456") {
    user { id email }
    token
  }
}

# 2. Copiar token e adicionar no header HTTP
# Authorization: Bearer SEU_TOKEN_AQUI

# 3. Query protegida
query {
  users {
    id
    email
    admin
  }
}
```

## 🗄 Database

### Acessar PostgreSQL
```bash
# Via Docker
docker-compose exec postgres psql -U postgres -d fono_development

# Ou se tiver psql instalado localmente
psql -h localhost -p 5433 -U postgres -d fono_development
```

### Comandos Úteis
```sql
-- Listar tabelas
\dt

-- Ver estrutura de tabela
\d users

-- Queries úteis
SELECT * FROM users;
SELECT * FROM patients WHERE deleted_at IS NULL;
SELECT * FROM jwt_denylist ORDER BY exp DESC LIMIT 10;
```

### Reset Completo
```bash
cd backend
rails db:drop db:create db:migrate db:seed
```

## 🧪 Testes

### Estrutura
```
backend/spec/
├── factories/        # FactoryBot definitions
├── models/          # Testes de models
├── mutations/       # Testes de mutations (futuro)
└── requests/        # Testes de integração (futuro)
```

### Rodar Testes
```bash
cd backend

# Todos os testes
bundle exec rspec

# Arquivo específico
bundle exec rspec spec/models/user_spec.rb

# Linha específica
bundle exec rspec spec/models/user_spec.rb:10

# Com cobertura
COVERAGE=true bundle exec rspec
```

### Criar Novo Teste
```bash
cd backend

# Model
rails g rspec:model Patient

# Request
rails g rspec:request Graphql
```

## 🚀 Deploy (Futuro)

### Preparação
```bash
# Backend
cd backend
RAILS_ENV=production rails assets:precompile
RAILS_ENV=production rails db:migrate

# Frontend
cd frontend
npm run build
```

### Variáveis de Ambiente Produção
- `DEVISE_JWT_SECRET_KEY` - Gerar novo com `rails secret`
- `DATABASE_URL` - URL do PostgreSQL remoto
- `REDIS_URL` - URL do Redis remoto
- `FRONTEND_URL` - URL pública do frontend
- `RAILS_SERVE_STATIC_FILES=true` (se sem CDN)
- `RAILS_LOG_TO_STDOUT=true`

## 🔗 Recursos Úteis

### Documentação
- [Rails Guides](https://guides.rubyonrails.org/)
- [GraphQL Ruby](https://graphql-ruby.org/)
- [Next.js Docs](https://nextjs.org/docs)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Devise](https://github.com/heartcombo/devise)
- [Paranoia](https://github.com/rubysherpas/paranoia)

### Gems Importantes
```ruby
# Gemfile principais
gem 'graphql'           # GraphQL server
gem 'devise'            # Autenticação
gem 'devise-jwt'        # JWT para Devise
gem 'paranoia'          # Soft delete
gem 'rack-cors'         # CORS
```

### Packages Frontend
```json
{
  "@apollo/client": "3.13.9",
  "next": "14.2.15",
  "react": "^18",
  "graphql": "^16"
}
```

## 📋 Checklist de PR

Antes de abrir Pull Request:
- [ ] Código segue convenções do projeto
- [ ] Testes passando (`bundle exec rspec`)
- [ ] Frontend builda sem erros (`npm run build`)
- [ ] Migrations rodadas e testadas
- [ ] Documentação atualizada (se necessário)
- [ ] BACKLOG.md atualizado (se feature grande)
- [ ] Commit messages seguem Conventional Commits
- [ ] Sem `console.log` ou `binding.pry` esquecidos

## 🐛 Issues Comuns

### "Port already in use"
```bash
# Matar processo na porta
kill -9 $(lsof -ti:3001)  # Backend
kill -9 $(lsof -ti:4000)  # Frontend
```

### "Database does not exist"
```bash
cd backend
rails db:create db:migrate db:seed
```

### "GraphQL mutation returns null"
```bash
# Verificar logs do backend
tail -f logs/backend.log

# Verificar se está autenticado (JWT válido)
# Verificar se mutation tem require_authentication!
```

### "Apollo Client network error"
```bash
# Verificar se backend está rodando
curl http://localhost:3001/graphql

# Verificar CORS em backend/config/initializers/cors.rb
# Deve permitir origem http://localhost:4000
```

---

**Para dúvidas, consulte o README.md ou abra uma issue.**
