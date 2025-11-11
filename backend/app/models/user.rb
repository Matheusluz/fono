# frozen_string_literal: true

# User model with JWT authentication via Devise.
# Manages user accounts with email/password and JWT token revocation strategy.
class User < ApplicationRecord
  include ActiveModel::Validations

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Associações
  has_one :professional, dependent: :destroy
  
  # Enumeração de roles
  enum role: {
    admin: 0,
    professional: 1,
    assistant: 2
  }

  # Para permitir que apenas email e password sejam passados na criação
  attr_accessor :skip_password_validation

  # Validação antes de deletar: impedir que usuário delete a si mesmo
  before_destroy :prevent_self_deletion

  # Helper method para verificar se é admin (já existe via enum, mas mantém compatibilidade)
  def admin?
    super || admin # enum gera método admin? automaticamente
  end

  # Gera um token JWT para o usuário
  # @return [String] JWT token válido por 1 dia
  def generate_jwt_token
    payload = {
      sub: id,
      exp: 1.day.from_now.to_i,
      iat: Time.current.to_i
    }

    secret = Rails.application.credentials&.dig(:devise, :jwt_secret_key) ||
             ENV['DEVISE_JWT_SECRET_KEY'] || 'secret'

    JWT.encode(payload, secret, 'HS256')
  end

  # Autentica usuário com email e senha
  # @param email [String] Email do usuário
  # @param password [String] Senha do usuário
  # @return [User, nil] Retorna o usuário se autenticado, nil caso contrário
  def self.authenticate(email, password)
    user = find_by(email: email)
    user if user&.valid_password?(password)
  end

  private

  def prevent_self_deletion
    return true unless Current.user

    if id == Current.user.id
      errors.add(:base, 'Você não pode deletar sua própria conta')
      throw(:abort)
    end
  end
end
