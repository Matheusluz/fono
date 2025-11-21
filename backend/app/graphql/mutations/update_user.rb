# frozen_string_literal: true

module Mutations
  # Mutation para atualizar um usuário existente
  # Requer autenticação
  class UpdateUser < BaseMutation
    argument :id, ID, required: true
    argument :email, String, required: false
    argument :password, String, required: false
    argument :password_confirmation, String, required: false
    argument :admin, Boolean, required: false
    argument :theme_preference, String, required: false

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      # Verificar se o usuário está autenticado
      require_authentication!

      user = User.find_by(id: id)

      unless user
        return { user: nil, errors: ["Usuário não encontrado"] }
      end

      if user.update(attributes)
        { user: user, errors: [] }
      else
        { user: nil, errors: user.errors.full_messages }
      end
    end
  end
end
