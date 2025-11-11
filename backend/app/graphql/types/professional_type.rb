# frozen_string_literal: true

module Types
  class ProfessionalType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, Integer, null: false
    field :user, Types::UserType, null: false
    field :specialty, String, null: false
    field :council_registration, String, null: true
    field :bio, String, null: true
    field :active, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # Campo calculado para pegar o email do usuário
    field :email, String, null: false
    def email
      object.user.email
    end

    # Campo calculado para full_name (quando existir no User)
    field :full_name, String, null: false
    def full_name
      object.full_name
    end
  end
end
