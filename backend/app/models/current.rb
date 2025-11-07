# frozen_string_literal: true

# Classe utilitária para armazenar o usuário atual no contexto da thread
# Permite que models e services acessem o usuário autenticado sem passar explicitamente
# Uso: Current.user = user (no controller/graphql)
#      Current.user (em qualquer lugar da aplicação)
class Current < ActiveSupport::CurrentAttributes
  attribute :user
end
