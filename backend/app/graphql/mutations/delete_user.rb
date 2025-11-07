# frozen_string_literal: true

module Mutations
  # Mutation para deletar um usuário
  # Requer autenticação
  class DeleteUser < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      # Verificar se o usuário está autenticado
      require_authentication!

      user = User.find_by(id: id)

      return { success: false, errors: ['Usuário não encontrado'] } unless user

      # A validação de self-deletion está no callback before_destroy do User
      if user.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: user.errors.full_messages }
      end
    end
  end
end
