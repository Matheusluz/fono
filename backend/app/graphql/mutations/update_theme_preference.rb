# frozen_string_literal: true

module Mutations
  # Mutation para atualizar a preferência de tema do usuário atual
  # Requer autenticação
  class UpdateThemePreference < BaseMutation
    argument :theme_preference, String, required: true

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(theme_preference:)
      # Verificar se o usuário está autenticado
      require_authentication!

      # Validar valor do tema
      unless %w[light dark].include?(theme_preference)
        return { user: nil, errors: ["Tema deve ser 'light' ou 'dark'"] }
      end

      if context[:current_user].update(theme_preference: theme_preference)
        { user: context[:current_user], errors: [] }
      else
        { user: nil, errors: context[:current_user].errors.full_messages }
      end
    end
  end
end