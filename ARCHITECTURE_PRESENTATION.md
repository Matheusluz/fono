# Apresentação Técnica do Projeto Fono

## 1. Visão Geral
Este projeto é um monorepo contendo:
- Backend: Ruby on Rails (API only) com GraphQL, autenticação JWT via Devise + devise-jwt.
- Frontend: Next.js (App Router) + React + Apollo Client para consumir a API GraphQL.
- Banco: PostgreSQL; Redis previsto para futuras filas (Sidekiq configurável).

Objetivo: Gerenciar usuários e pacientes com um fluxo de autenticação seguro e escalável usando GraphQL como camada de API unificada.

## 2. Stack Principal
| Camada | Tecnologias | Papel |
|--------|-------------|-------|
| Backend | Rails 7 (API), graphql-ruby, Devise, devise-jwt | Lógica de negócio, autenticação, schema GraphQL |
| Frontend | Next.js, React, Apollo Client, TailwindCSS | UI, fluxo de login, consumo de GraphQL |
| Banco | PostgreSQL | Persistência dos dados |
| Auth | JWT (HMAC HS256) | Sessão stateless entre frontend e backend |
| Testes | RSpec, FactoryBot (iniciado) | Validação de modelo e lógica futura |
| Infra | Docker Compose (planejado), Seeds | Provisionamento e bootstrap |

## 3. Backend (Rails + GraphQL)

### 3.1 Estrutura
- `app/graphql/` contém schema, types, mutations.
- `app/controllers/graphql_controller.rb` recebe POST /graphql e delega para `BackendSchema.execute`.
- Modelos: `User`, `Patient`, `JwtDenylist`.
- Auth: Devise + JWT; token entregue no login e usado em Authorization header.

### 3.2 Ciclo de Requisição GraphQL
1. Cliente envia mutation/query para `/graphql`.
2. Controller monta `context` (inclui `current_user` se token válido).
3. Schema (types + resolvers/mutations) executa e retorna JSON.

### 3.3 Criando Nova Mutation
Arquivo exemplo: `app/graphql/mutations/register_user.rb`
Passos:
1. Criar classe em `app/graphql/mutations/NovaCoisa.rb`.
2. Definir argumentos, campos de retorno e método `resolve`.
3. Adicionar referência em `Types::MutationType`.
4. Testar via Postman ou Apollo.

Exemplo simplificado:
```ruby
module Mutations
  class TogglePatientActive < BaseMutation
    argument :id, ID, required: true
    field :patient, Types::PatientType, null: true
    field :errors, [String], null: false

    def resolve(id:)
      patient = Patient.find_by(id: id)
      return { patient: nil, errors: ['Paciente não encontrado'] } unless patient
      patient.update(active: !patient.active)
      { patient: patient, errors: [] }
    end
  end
end
```

### 3.4 Autenticação JWT
- Login gera JWT assinado com chave (`credentials` ou ENV).
- Token inclui `sub` (user id), `exp` (expiração), `iat` (emitido em).
- Em cada requisição, backend tenta extrair `Authorization: Bearer <token>`.
- Estratégia de revogação: denylist (`JwtDenylist`), em progresso.

### 3.5 Adicionando Novo Model (Ex: TherapySession)
1. Gerar migration:
   ```bash
   rails g model TherapySession patient:references date:date notes:text
   rails db:migrate
   ```
2. Criar Type GraphQL `Types::TherapySessionType`.
3. Adicionar queries: lista e item.
4. Adicionar mutations (create/update/delete).
5. Testes RSpec (model + mutations).

### 3.6 Boas Práticas
- Manter lógica complexa fora dos resolvers (Service Objects).
- Evitar N+1 usando `includes` ou DataLoader (futuro).
- Validar entrada: usar validações ActiveRecord e retornar mensagens pelo `errors`.

## 4. Frontend (Next.js + React + Apollo)

### 4.1 Estrutura
- `src/app/` rotas usando App Router (páginas server/client).
- `src/context/AuthContext.tsx` gerencia estado do usuário e token.
- `src/lib/apollo.ts` configura ApolloClient + auth link.
- `middleware.ts` protege rotas `/home` baseado em cookie simples.

### 4.2 Fluxo de Login
1. Usuário acessa `/` (login).
2. Mutation `loginUser` retorna `token` + dados do usuário.
3. Token armazenado em `localStorage` e cookie (dev) -> usado em header.
4. Redireciona para `/home` e carrega dados protegidos.

### 4.3 Criar Nova Página
Exemplo: criar `/patients` listando pacientes.
1. Criar `src/app/patients/page.tsx`.
2. Definir se será server (sem hooks) ou client (`"use client"`).
3. Usar Apollo (se client) ou `fetch` + POST GraphQL manual (server).
4. Renderizar lista.

### 4.4 Exemplo Página Client
```tsx
"use client"
import { useQuery, gql } from '@apollo/client'

const PATIENTS_QUERY = gql`query { patients { id name } }`

export default function PatientsPage() {
  const { data, loading } = useQuery(PATIENTS_QUERY)
  if (loading) return <p>Carregando...</p>
  return (
    <ul>{data.patients.map((p: any) => <li key={p.id}>{p.name}</li>)}</ul>
  )
}
```

### 4.5 Protegendo Página
Usar `useAuth()` em client component ou checar cookie em `middleware.ts`.

### 4.6 Server Component Consumindo GraphQL (Opcional)
```tsx
// page.tsx sem "use client"
export default async function Patients() {
  const res = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${/* token */ ''}` },
    body: JSON.stringify({ query: 'query { patients { id name } }' }),
    cache: 'no-store'
  })
  const json = await res.json()
  return <pre>{JSON.stringify(json.data.patients, null, 2)}</pre>
}
```

## 5. Data Modeling & Migrations
### Passos Gerais
1. Criar migration (gerador Rails).
2. Rodar `rails db:migrate`.
3. Atualizar GraphQL Types.
4. Expor queries e mutations.
5. Testar com Postman / Apollo.
6. Adicionar seeds se necessário.

### Adicionando Campo a `Patient`
```bash
rails g migration AddBirthDateToPatients birth_date:date
rails db:migrate
```
Atualizar `Types::PatientType`:
```ruby
field :birth_date, GraphQL::Types::ISO8601Date, null: true
```
Atualizar mutations de criação/atualização para aceitar `birth_date`.

## 6. Ciclo para Criar Recurso Novo (Resumo)
1. Model + Migration
2. Validar regras (ex: presença, formato, domínios).
3. GraphQL Type + Queries
4. Mutations CRUD
5. Testes (model + mutations)
6. Frontend página de listagem + criação
7. Proteção (auth + roles se necessário)
8. Documentar no README

## 7. Autenticação e Autorização
### Atual
- JWT simples com expiração 1 dia.
- Verificação manual em `ApplicationController` decodificando token.
- Context GraphQL carrega `current_user`.

### Futuro
- Refresh token
- Revogação forte (denylist populada no logout)
- Roles + Pundit/CanCanCan para autorização granular

## 8. Testes
### Backend
- Model specs: validações, associações.
- Mutation specs: sucesso + erros (ex: usuário não autenticado).
### Frontend
- Componentes com React Testing Library.
- AuthContext (mock Apollo Client). 
- E2E (Playwright ou Cypress): login -> home -> logout.

## 9. Metodologias / Boas Práticas
- **Responsabilidade única:** cada mutation faz uma coisa clara.
- **Fail fast:** retornar erros imediatamente se recurso não existe.
- **Consistência de retorno:** `{ dataPart, errors: [] }` vs `{ dataPart: nil, errors: ["msg"] }`.
- **Idempotência:** seeds podem rodar múltiplas vezes.
- **Ambientes isolados:** usar variáveis para segredos (JWT, DB).
- **Separação de camadas:** resolver delega para modelos / serviços.

## 10. Roadmap de Aprendizado (GraphQL, React/Next.js, NestJS)
### GraphQL
1. Schema, Type, Field, Resolver – diferença.
2. Queries vs Mutations vs Subscriptions.
3. Autenticação via context.
4. Paginação (Connections / Cursor) – futuro.
5. N+1 e DataLoader.
6. Fragments e reutilização no frontend.

### React / Next.js
1. App Router vs Pages Router.
2. Server Components vs Client Components.
3. Context API para estado global.
4. Hooks principais: `useState`, `useEffect`, `useCallback`.
5. Integração Apollo + Suspense (experimental).
6. Middleware e Edge Runtime (futuro).

### NestJS (Para futura adoção ou comparação)
1. Módulos, Providers, Controllers, Services.
2. Nest GraphQL (`@nestjs/graphql`) – decoradores para schema.
3. Autenticação com Guards e Passport JWT.
4. Pipes para validação (class-validator).
5. Interceptors para logging e transformação.
6. Migrar: cada mutation → resolver Nest + DTO.

## 11. Migração Conceitual Rails → NestJS (Se ocorrer)
| Rails (atual) | NestJS equivalente |
|---------------|--------------------|
| Model ActiveRecord | TypeORM/Prisma Entity |
| Mutation Class | Resolver Method |
| GraphqlController | auto gerado pelo módulo GraphQL |
| Devise JWT | Passport JWT Strategy |
| Services Plain Ruby | Injectable Services |

## 12. Segurança e Melhoria de Produção (Checklist Futuro)
- [ ] Remover uso de localStorage para token (apenas cookie httpOnly).
- [ ] Rotacionar chave JWT periodicamente.
- [ ] Monitorar tempo de resposta (APM).
- [ ] Adicionar compressão e cache em nível de CDN.
- [ ] Implementar feature flags.

## 13. Exemplo Completo: Novo Recurso "Appointment"
1. Migration: `rails g model Appointment patient:references starts_at:datetime duration_minutes:integer notes:text`
2. Model validações (`presence`, `numericality`).
3. Type GraphQL:
```ruby
class Types::AppointmentType < Types::BaseObject
  field :id, ID, null: false
  field :patient, Types::PatientType, null: false
  field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
  field :duration_minutes, Integer, null: false
  field :notes, String, null: true
end
```
4. Query: lista + uma (por id).
5. Mutations: create/update/delete.
6. Frontend: página `/appointments` com listagem e criação.
7. Testes: model + mutation + e2e.
8. Documentar no README.

## 14. Dicas de Ensino Para Outros Devs
- Começar executando queries simples no GraphQL.
- Mostrar a diferença entre REST (múltiplos endpoints) vs GraphQL (um endpoint, múltiplas operações).
- Fazer pairing na criação de uma mutation nova.
- Revisar padrões de retorno (sempre erros explícitos).
- Explicar contexto de autenticação (onde `current_user` entra).
- Mostrar comparação futura com NestJS para ampliar visão arquitetural.

## 15. Próximos Passos Recomendados
1. Implementar testes para `loginUser` e `registerUser`.
2. Adicionar paginação simples em `patients`.
3. Melhorar segurança do token (cookie httpOnly).
4. Adicionar interface para criação de pacientes no frontend.
5. Introduzir DataLoader.
6. Criar dashboard admin.

---
Este documento serve como base de estudo e onboarding. Expanda conforme o projeto cresce.
