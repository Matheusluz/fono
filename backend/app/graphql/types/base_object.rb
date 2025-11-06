# frozen_string_literal: true

module Types
  # BaseObject é a classe base para todos os tipos GraphQL
  # Fornece métodos auxiliares compartilhados entre queries e tipos
  class BaseObject < GraphQL::Schema::Object
    edge_type_class(Types::BaseEdge)
    connection_type_class(Types::BaseConnection)
    field_class Types::BaseField

    # Método auxiliar para validar autenticação
    # Lança exceção se o usuário não estiver autenticado
    def require_authentication!
      return if context[:current_user]

      raise GraphQL::ExecutionError, 'Você precisa estar autenticado para acessar este recurso'
    end

    # Retorna o usuário atual do contexto
    def current_user
      context[:current_user]
    end
  end
end
