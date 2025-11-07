module Mutations
  class LoginUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:)
      user = User.authenticate(email, password)

      if user
        {
          user: user,
          token: user.generate_jwt_token,
          errors: []
        }
      else
        {
          user: nil,
          token: nil,
          errors: ['Email ou senha inválidos']
        }
      end
    end
  end
end