# frozen_string_literal: true

module Mutations
  # BaseMutation é a classe base para todas as mutations GraphQL
  # Fornece métodos auxiliares compartilhados entre mutations
  class BaseMutation < GraphQL::Schema::Mutation
    # Método auxiliar para validar autenticação
    # Lança exceção se o usuário não estiver autenticado
    def require_authentication!
      return if context[:current_user]

      raise GraphQL::ExecutionError, 'Você precisa estar autenticado para realizar esta ação'
    end

    # Retorna o usuário atual do contexto
    def current_user
      context[:current_user]
    end
  end
end
