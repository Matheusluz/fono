# frozen_string_literal: true

# User model with JWT authentication via Devise.
# Manages user accounts with email/password and JWT token revocation strategy.
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Para permitir que apenas email e password sejam passados na criação
  attr_accessor :skip_password_validation

  # Helper method para verificar se é admin
  def admin?
    admin
  end
end
