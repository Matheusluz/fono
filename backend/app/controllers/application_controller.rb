class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  def current_user
    @current_user ||= authenticate_user_from_token
  end

  private

  def authenticate_user_from_token
    authenticate_with_http_token do |token, _options|
      # Decodificar o JWT token
      decoded_token = JWT.decode(token, 
        Rails.application.credentials&.dig(:devise, :jwt_secret_key) || ENV['DEVISE_JWT_SECRET_KEY'] || 'secret',
        true,
        { algorithm: 'HS256' }
      )
      
      # Extrair o ID do usuário do payload
      user_id = decoded_token[0]['sub']
      User.find_by(id: user_id)
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      nil
    end
  end
end

