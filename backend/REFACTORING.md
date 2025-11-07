# Refatorações - Lógica de Negócio nas Models

## Problemas Identificados e Soluções

### ✅ **Problema 1: Geração de JWT Token na Mutation**
**Antes:** `LoginUser` mutation continha toda lógica de geração de token JWT (15 linhas)

**Depois:** Movido para `User` model
```ruby
# app/models/user.rb
def generate_jwt_token
  payload = { sub: id, exp: 1.day.from_now.to_i, iat: Time.current.to_i }
  secret = Rails.application.credentials&.dig(:devise, :jwt_secret_key) || ENV['DEVISE_JWT_SECRET_KEY'] || 'secret'
  JWT.encode(payload, secret, 'HS256')
end

def self.authenticate(email, password)
  user = find_by(email: email)
  user if user&.valid_password?(password)
end
```

**Mutation agora:**
```ruby
def resolve(email:, password:)
  user = User.authenticate(email, password)
  user ? { user: user, token: user.generate_jwt_token, errors: [] } : { user: nil, token: nil, errors: ['Email ou senha inválidos'] }
end
```

---

### ✅ **Problema 2: Falta de Autenticação em Patient Mutations**
**Antes:** `CreatePatient`, `UpdatePatient`, `DeletePatient`, `RestorePatient` eram públicas

**Depois:** Todas agora chamam `require_authentication!` na primeira linha

```ruby
def resolve(...)
  require_authentication!
  # ... resto do código
end
```

---

## Resumo das Mudanças

### Arquivos Modificados:

#### Models:
- ✅ `app/models/user.rb` - Adicionados métodos `generate_jwt_token` e `self.authenticate`

#### Mutations:
- ✅ `app/graphql/mutations/login_user.rb` - Simplificada (36 → 16 linhas)
- ✅ `app/graphql/mutations/create_patient.rb` - Adicionada autenticação
- ✅ `app/graphql/mutations/update_patient.rb` - Adicionada autenticação
- ✅ `app/graphql/mutations/delete_patient.rb` - Adicionada autenticação
- ✅ `app/graphql/mutations/restore_patient.rb` - Adicionada autenticação

---

## Benefícios

### 1. **Single Responsibility Principle**
- ✅ Mutations são apenas controladores finos
- ✅ Models contêm lógica de negócio

### 2. **Reutilização**
- ✅ `User.authenticate(email, password)` pode ser usado em console, jobs, etc
- ✅ `user.generate_jwt_token` pode ser usado em outros contextos (refresh tokens, etc)

### 3. **Testabilidade**
- ✅ Pode testar geração de token direto na model
- ✅ Pode testar autenticação sem GraphQL
- ✅ Testes mais rápidos (não precisa de request completo)

### 4. **Segurança**
- ✅ TODAS as operações de Patient agora requerem autenticação
- ✅ Consistência: não é possível esquecer de adicionar autenticação

### 5. **Manutenibilidade**
- ✅ Código mais limpo e organizado
- ✅ Fácil entender onde cada coisa está
- ✅ Mudanças em um lugar só (DRY)

---

## Próximos Passos Recomendados

1. **Adicionar Auditing** - Usar `Auditable` concern para rastrear quem criou/atualizou
2. **Token Refresh** - Implementar refresh tokens usando `generate_jwt_token`
3. **Testes** - Criar specs para os novos métodos nas models
4. **Soft Delete em User** - Adicionar paranoia gem no User também
5. **Permissões** - Criar concern de autorização (não só autenticação)
