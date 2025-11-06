# frozen_string_literal: true

module Extensions
  # Extension para validar autenticação automaticamente em fields
  # Uso: field :users, [Types::UserType], extensions: [Extensions::AuthenticationExtension]
  class AuthenticationExtension < GraphQL::Schema::FieldExtension
    def resolve(object:, arguments:, context:)
      unless context[:current_user]
        raise GraphQL::ExecutionError, 'Você precisa estar autenticado para acessar este recurso'
      end

      # Continua a execução normal do field
      yield(object, arguments)
    end
  end
end
