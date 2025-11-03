module Mutations
  class LoginUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:)
      user = User.find_by(email: email)
      
      if user&.valid_password?(password)
        # Gerar JWT token manualmente
        payload = {
          sub: user.id,
          exp: 1.day.from_now.to_i,
          iat: Time.current.to_i
        }
        
        secret = Rails.application.credentials&.dig(:devise, :jwt_secret_key) || 
                ENV['DEVISE_JWT_SECRET_KEY'] || 'secret'
        
        token = JWT.encode(payload, secret, 'HS256')
        
        { 
          user: user, 
          token: token, 
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