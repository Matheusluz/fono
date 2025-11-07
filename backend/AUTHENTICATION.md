# Autenticação no GraphQL

## Current User Context

O usuário autenticado está disponível globalmente através da classe `Current`:

```ruby
Current.user  # Retorna o usuário autenticado (ou nil)
```

### Como funciona:

1. **GraphqlController** define `Current.user = current_user` no início de cada request
2. **ActiveSupport::CurrentAttributes** garante que seja thread-safe e limpo automaticamente
3. **Models e Services** podem acessar `Current.user` em qualquer lugar

### Vantagens:
- ✅ Não precisa passar `current_user` explicitamente
- ✅ Thread-safe (cada request tem seu próprio contexto)
- ✅ Limpeza automática após cada request
- ✅ Funciona em callbacks, validations, services, etc

### Exemplo de uso em Models:

```ruby
class User < ApplicationRecord
  before_destroy :prevent_self_deletion

  private

  def prevent_self_deletion
    if Current.user && id == Current.user.id
      errors.add(:base, 'Você não pode deletar sua própria conta')
      throw(:abort)
    end
  end
end
```

---

## Métodos Disponíveis

### 1. Método Helper: `require_authentication!`

Disponível em todas as queries (`Types::BaseObject`) e mutations (`Mutations::BaseMutation`).

**Uso em Queries:**
```ruby
field :patients, [Types::PatientType], null: false

def patients
  require_authentication!  # Lança erro se não autenticado
  Patient.all
end
```

**Uso em Mutations:**
```ruby
def resolve(email:, password:)
  require_authentication!  # Lança erro se não autenticado
  # ... resto do código
end
```

**Helper adicional:**
- `current_user` - Retorna o usuário autenticado (ou nil)

---

### 2. Extension: `AuthenticationExtension`

Aplica validação automaticamente no field, sem precisar chamar método.

**Uso:**
```ruby
field :users, [Types::UserType], 
      null: false,
      extensions: [Extensions::AuthenticationExtension]

def users
  # Não precisa chamar require_authentication!
  # A extension já valida automaticamente
  User.all
end
```

**Vantagem:** Declarativo, validação antes do método ser executado.

---

## Queries/Mutations Protegidas

Atualmente **TODAS** as queries e mutations estão protegidas:

- ✅ `patients` - Requer autenticação
- ✅ `patient(id)` - Requer autenticação  
- ✅ `patients_with_deleted` - Requer autenticação
- ✅ `users` - Requer autenticação
- ✅ `registerUser` - Requer autenticação
- ✅ `updateUser` - Requer autenticação
- ✅ `deleteUser` - Requer autenticação (+ validação de self-delete)
- ⚠️ `currentUser` - Retorna nil se não autenticado (não bloqueia)
- ⚠️ `loginUser` - Público (necessário para login)
- ⚠️ `logoutUser` - Público (mas só funciona se autenticado)

## Como Funciona

1. **GraphqlController** injeta `current_user` no contexto:
   ```ruby
   context = { current_user: current_user }
   ```

2. **ApplicationController** decodifica JWT do header Authorization:
   ```ruby
   def current_user
     authenticate_user_from_token
   end
   ```

3. **Queries/Mutations** validam usando `require_authentication!` que verifica `context[:current_user]`
