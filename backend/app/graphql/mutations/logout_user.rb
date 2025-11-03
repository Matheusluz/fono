module Mutations
  class LogoutUser < BaseMutation
    field :message, String, null: false
    field :success, Boolean, null: false

    def resolve
      current_user = context[:current_user]
      
      unless current_user
        return {
          message: "Usuário não está logado",
          success: false
        }
      end

      # Aqui você pode adicionar o token à denylist se quiser
      # Por enquanto, apenas retornamos sucesso
      # O frontend deve descartar o token
      
      {
        message: "Logout realizado com sucesso",
        success: true
      }
    end
  end
end