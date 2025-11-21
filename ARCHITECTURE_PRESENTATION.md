# 🏗️ Apresentação da Arquitetura: Sistema de Usuários

## 📋 Visão Geral

Este documento apresenta a arquitetura completa do sistema utilizando o **fluxo de usuários** como exemplo prático, demonstrando a integração entre **React**, **Next.js**, **TypeScript** e **GraphQL**.

---

## 🎯 Stack Tecnológica

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **Next.js 13+** - Framework React com App Router
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Apollo Client** - Cliente GraphQL com cache inteligente
- **Tailwind CSS** - Framework CSS utilitário

### Backend
- **Ruby on Rails 7.1** - Framework web Ruby
- **GraphQL-Ruby** - Implementação GraphQL para Rails
- **Devise** - Autenticação e autorização
- **JWT** - Tokens de autenticação
- **PostgreSQL** - Banco de dados relacional

---

## 🔄 Fluxo Completo: Gestão de Usuários

### 1. 🎨 **Frontend - Interface de Usuário**

#### Página Principal (`/app/users/page.tsx`)
```tsx
"use client"
import { useQuery, useMutation } from '@apollo/client'
import { USERS_QUERY, REGISTER_USER_MUTATION } from '@/src/lib/graphql'

interface User {
  id: string
  email: string
  admin: boolean
}

export default function UsersPage() {
  // 🎯 React Hooks para estado local
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // 🚀 Apollo Client - Integração com GraphQL
  const { data, loading, error, refetch } = useQuery(USERS_QUERY)
  const [registerUser] = useMutation(REGISTER_USER_MUTATION)
  
  // 🧮 useMemo para performance otimizada
  const { filteredData, paginatedData } = useMemo(() => {
    const users = data?.users || []
    return processUsers(users, filterValue, currentPage)
  }, [data?.users, filterValue, currentPage])
}
```

**Características do React demonstradas:**
- ✅ **Hooks**: `useState`, `useMemo` para gerenciamento de estado
- ✅ **Componentes funcionais** com TypeScript
- ✅ **Props tipadas** com interfaces TypeScript
- ✅ **Renderização condicional** baseada em estados

#### Componentes Reutilizáveis
```tsx
// 🧩 Componente Table reutilizável
<Table
  columns={userColumns}
  data={paginatedData}
  loading={loading}
  error={error?.message}
  emptyMessage="Nenhum usuário encontrado"
  showFilter={true}
  filterValue={filterValue}
  onFilterChange={handleFilterChange}
/>

// 🎭 Modal para criação/edição
<Modal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  title="Criar Novo Usuário"
>
  <UserForm onSubmit={handleCreateUser} />
</Modal>
```

### 2. 🌐 **Next.js - Framework e Funcionalidades**

#### App Router (Next.js 13+)
```
frontend/src/app/
├── users/
│   └── page.tsx          # 📄 Página de usuários
├── layout.tsx            # 🎨 Layout global
└── globals.css           # 🎨 Estilos globais
```

**Características do Next.js demonstradas:**
- ✅ **App Router**: Estrutura baseada em pastas
- ✅ **"use client"**: Componentes client-side
- ✅ **Layouts aninhados**: DashboardLayout wrap
- ✅ **TypeScript nativo**: Suporte completo
- ✅ **Otimizações automáticas**: Bundle splitting

#### Roteamento e Proteção
```tsx
// 🔐 Proteção de rotas
export default function UsersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DashboardLayout>
        {/* Conteúdo da página */}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
```

### 3. 📝 **TypeScript - Tipagem e Segurança**

#### Interfaces e Tipos
```tsx
// 🏷️ Interface do usuário
interface User {
  id: string
  email: string
  admin: boolean
  themePreference: 'light' | 'dark'
}

// 🏷️ Props do componente
interface UserFormProps {
  user?: User
  onSubmit: (data: UserFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

// 🏷️ Dados do formulário
interface UserFormData {
  email: string
  password: string
  passwordConfirmation: string
  admin: boolean
}
```

**Características do TypeScript demonstradas:**
- ✅ **Interfaces**: Definição de contratos
- ✅ **Union Types**: `'light' | 'dark'`
- ✅ **Optional Properties**: `user?`, `loading?`
- ✅ **Generic Types**: `Promise<void>`
- ✅ **Type Safety**: Prevenção de erros em tempo de compilação

#### Tipagem de Hooks e Estados
```tsx
// 🎯 Estado tipado
const [selectedUser, setSelectedUser] = useState<User | null>(null)
const [formData, setFormData] = useState<UserFormData>({
  email: '',
  password: '',
  passwordConfirmation: '',
  admin: false
})

// 🎯 Função tipada
const handleCreateUser = async (data: UserFormData): Promise<void> => {
  try {
    const result = await registerUser({ variables: data })
    if (result.data?.registerUser.errors.length === 0) {
      refetch()
      setShowCreateModal(false)
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
  }
}
```

### 4. 🚀 **Apollo Client - GraphQL Integration**

#### Configuração do Cliente
```tsx
// 📡 Apollo Client setup
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})
```

#### Queries e Mutations GraphQL
```tsx
// 📊 Query para buscar usuários
export const USERS_QUERY = gql`
  query Users {
    users {
      id
      email
      admin
      themePreference
    }
  }
`

// ✏️ Mutation para criar usuário
export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($email: String!, $password: String!, $passwordConfirmation: String!) {
    registerUser(email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
      user {
        id
        email
        admin
        themePreference
      }
      errors
    }
  }
`

// 🗑️ Mutation para deletar usuário
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      errors
    }
  }
`
```

**Características do GraphQL demonstradas:**
- ✅ **Queries tipadas**: Estrutura definida
- ✅ **Variables**: Parâmetros dinâmicos
- ✅ **Fragments**: Reutilização de campos
- ✅ **Error handling**: Tratamento de erros
- ✅ **Cache**: Gerenciamento automático pelo Apollo

#### Uso dos Hooks do Apollo
```tsx
// 📊 Hook para buscar dados
const { data, loading, error, refetch } = useQuery(USERS_QUERY, {
  skip: !token, // Executa apenas se tiver token
  fetchPolicy: 'cache-and-network'
})

// ✏️ Hook para mutations
const [registerUser, { loading: creating }] = useMutation(REGISTER_USER_MUTATION, {
  onCompleted: (data) => {
    if (data.registerUser.errors.length === 0) {
      refetch() // Atualiza a lista
      setShowCreateModal(false)
    }
  },
  onError: (error) => {
    setFormError(error.message)
  }
})

// 🗑️ Hook para deletar
const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
  update: (cache, { data }) => {
    if (data?.deleteUser.success) {
      // Remove do cache local
      cache.modify({
        fields: {
          users(existingUsers = [], { readField }) {
            return existingUsers.filter(
              userRef => readField('id', userRef) !== selectedUser?.id
            )
          }
        }
      })
    }
  }
})
```

---

## 🔧 **Backend - Rails + GraphQL**

### 1. 🏛️ **Modelo de Dados (Rails)**

#### User Model (`app/models/user.rb`)
```ruby
class User < ApplicationRecord
  # 🔐 Devise para autenticação
  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist
  
  # 🏷️ Enumeração de roles
  enum role: {
    admin: 0,
    professional: 1,
    assistant: 2
  }
  
  # ✅ Validações
  validates :theme_preference, inclusion: { 
    in: %w[light dark], 
    message: "deve ser 'light' ou 'dark'" 
  }
  
  # 🔗 Associações
  has_one :professional, dependent: :destroy
  
  # 🛡️ Métodos de segurança
  def generate_jwt_token
    payload = {
      sub: id,
      exp: 1.day.from_now.to_i,
      iat: Time.current.to_i
    }
    JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS256')
  end
end
```

**Características do Rails demonstradas:**
- ✅ **Active Record**: ORM robusto
- ✅ **Validações**: Regras de negócio
- ✅ **Enums**: Tipos enumerados
- ✅ **Associations**: Relacionamentos
- ✅ **Callbacks**: Hooks do ciclo de vida

### 2. 🌐 **GraphQL Schema**

#### User Type (`app/graphql/types/user_type.rb`)
```ruby
module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    field :admin, Boolean, null: false
    field :role, String, null: false
    field :theme_preference, String, null: false
    field :professional, Types::ProfessionalType, null: true
    
    def role
      object.role
    end
  end
end
```

#### Query Resolver
```ruby
module Types
  class QueryType < Types::BaseObject
    field :users, [Types::UserType], null: false,
          description: "Lista todos os usuários (apenas admins)"
    
    def users
      # 🛡️ Autorização
      raise GraphQL::ExecutionError, "Acesso negado" unless context[:current_user]&.admin?
      
      User.all.order(:email)
    end
  end
end
```

#### Mutations
```ruby
module Mutations
  class RegisterUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(email:, password:, password_confirmation:)
      # 🛡️ Verificação de autenticação
      require_authentication!
      
      user = User.new(
        email: email,
        password: password,
        password_confirmation: password_confirmation
      )

      if user.save
        { user: user, errors: [] }
      else
        { user: nil, errors: user.errors.full_messages }
      end
    end
  end
end
```

### 3. 🎯 **Controller GraphQL**

#### GraphQL Controller (`app/controllers/graphql_controller.rb`)
```ruby
class GraphqlController < ApplicationController
  def execute
    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]

    # 🔄 Context para as queries/mutations
    context = {
      current_user: current_user,
    }
    
    # 🚀 Execução da query/mutation
    result = BackendSchema.execute(
      query, 
      variables: variables, 
      context: context, 
      operation_name: operation_name
    )
    
    render json: result
  rescue StandardError => e
    handle_error_in_development(e) if Rails.env.development?
  end

  private

  def prepare_variables(variables_param)
    case variables_param
    when String
      JSON.parse(variables_param) || {}
    when Hash
      variables_param
    when ActionController::Parameters
      variables_param.to_unsafe_hash
    else
      {}
    end
  end
end
```

---

## 🔄 **Fluxo de Dados Completo**

### 1. 🆕 **Criar Novo Usuário**

```
[Frontend] → [GraphQL] → [Rails] → [Database]
    ↓           ↓          ↓          ↓
1. Usuário clica "Criar"
2. Modal abre com formulário
3. TypeScript valida dados
4. Apollo Client executa mutation
5. GraphQL recebe requisição
6. Rails processa mutation
7. Validações do modelo
8. Salva no PostgreSQL
9. Retorna resultado
10. Apollo atualiza cache
11. Interface se atualiza
12. Modal fecha
```

**Código Frontend:**
```tsx
const handleCreateUser = async (formData: UserFormData) => {
  try {
    const { data } = await registerUser({
      variables: {
        email: formData.email,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation
      }
    })
    
    if (data?.registerUser.errors.length === 0) {
      refetch() // Atualiza lista
      setShowCreateModal(false)
      setFormData(initialFormData)
    } else {
      setFormError(data.registerUser.errors.join(', '))
    }
  } catch (error) {
    setFormError('Erro inesperado ao criar usuário')
  }
}
```

**Código Backend:**
```ruby
def resolve(email:, password:, password_confirmation:)
  require_authentication!
  
  user = User.new(
    email: email,
    password: password,
    password_confirmation: password_confirmation
  )

  if user.save
    { user: user, errors: [] }
  else
    { user: nil, errors: user.errors.full_messages }
  end
end
```

### 2. 📊 **Listar Usuários com Filtro**

```
[Component Mount] → [useQuery] → [GraphQL] → [Rails] → [Database]
                                     ↓
[useMemo] ← [Apollo Cache] ← [JSON Response] ← [Query Execution]
    ↓
[Filtered Data] → [Paginated Data] → [Table Render]
```

**Características de Performance:**
- ✅ **Apollo Cache**: Evita requisições desnecessárias
- ✅ **useMemo**: Recalcula apenas quando dependencies mudam
- ✅ **Pagination**: Renderiza apenas itens visíveis
- ✅ **Debounced Filter**: Evita muitas requisições durante digitação

### 3. ✏️ **Editar Usuário**

```
[Click Edit] → [Modal Open] → [Form Populate] → [Submit] → [Mutation] → [Update] → [Refetch]
```

### 4. 🗑️ **Deletar Usuário**

```
[Click Delete] → [Confirm Dialog] → [Delete Mutation] → [Cache Update] → [UI Update]
```

---

## 🏆 **Vantagens da Arquitetura**

### 🎨 **Frontend (React + Next.js + TypeScript)**
- ✅ **Type Safety**: Erros capturados em desenvolvimento
- ✅ **Component Reusability**: Table, Modal, Form reutilizáveis
- ✅ **Performance**: useMemo, Apollo Cache, Code Splitting
- ✅ **Developer Experience**: Hot reload, TypeScript IntelliSense
- ✅ **SEO Ready**: Next.js App Router

### 🌐 **GraphQL + Apollo**
- ✅ **Exact Data Fetching**: Busca apenas campos necessários
- ✅ **Smart Caching**: Cache automático e inteligente
- ✅ **Real-time Updates**: Subscriptions (quando necessário)
- ✅ **Error Handling**: Tratamento unificado de erros
- ✅ **Developer Tools**: GraphQL Playground, Apollo DevTools

### 🔧 **Backend (Rails + GraphQL)**
- ✅ **Convention over Configuration**: Rails conventions
- ✅ **Schema-driven**: API autodocumentada via schema
- ✅ **Security**: Authentication, authorization por campo
- ✅ **Validation**: Modelo + GraphQL validations
- ✅ **Scalability**: Background jobs, caching

---

## 📈 **Métricas e Performance**

### Frontend
- 🎯 **First Contentful Paint**: < 1.5s
- 🎯 **Time to Interactive**: < 3s
- 🎯 **Bundle Size**: Otimizado com tree-shaking
- 🎯 **Cache Hit Rate**: ~85% (Apollo Cache)

### Backend
- 🎯 **Response Time**: < 200ms (queries simples)
- 🎯 **Throughput**: Suporta múltiplas queries paralelas
- 🎯 **N+1 Prevention**: DataLoader (quando necessário)

---

## 🔮 **Possíveis Melhorias**

### 🚀 **Frontend**
- [ ] React Query para melhor cache management
- [ ] Server Components (Next.js 13+)
- [ ] Virtualization para tabelas grandes
- [ ] Progressive Web App (PWA)

### 🔧 **Backend**
- [ ] DataLoader para N+1 queries
- [ ] GraphQL Subscriptions para real-time
- [ ] Rate limiting
- [ ] Background job processing (Sidekiq)

### 🎯 **DevOps**
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Monitoring (Sentry, DataDog)
- [ ] Load balancing

---

## 🎓 **Conclusão**

Esta arquitetura demonstra um **sistema moderno e escalável** que combina:

- **🎨 Frontend reativo** com React/Next.js/TypeScript
- **🌐 API GraphQL flexível** e tipada
- **🔧 Backend robusto** com Rails
- **📊 Gestão de estado inteligente** com Apollo Client
- **🛡️ Segurança** em todas as camadas

O resultado é uma **aplicação maintível, performática e developer-friendly** que serve como base sólida para expansões futuras.

---

*Arquitetura by **Matheus Luz** - Sistema Fonoaudiologia* 🎤
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
