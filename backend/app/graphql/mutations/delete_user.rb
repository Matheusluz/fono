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
      
      unless user
        return { success: false, errors: ["Usuário não encontrado"] }
      end

      # Impedir que o usuário delete a si mesmo
      if user.id == current_user.id
        return { success: false, errors: ["Você não pode deletar sua própria conta"] }
      end

      if user.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: user.errors.full_messages }
      end
    end
  end
end
