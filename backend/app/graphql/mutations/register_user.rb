module Mutations
  class RegisterUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(email:, password:, password_confirmation:)
      # Verificar se o usuário está autenticado
      current_user = context[:current_user]
      
      unless current_user
        raise GraphQL::ExecutionError, "Você precisa estar autenticado para criar usuários"
      end

      user = User.new(
        email: email,
        password: password,
        password_confirmation: password_confirmation
      )

      if user.save
        { user: user, errors: [] }
      else
        { user: nil, errors: user.errors.full_messages }
      end
    end
  end
end

