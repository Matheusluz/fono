# frozen_string_literal: true

module Types
  class SpecialtyType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :active, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :professionals_count, Integer, null: false

    def professionals_count
      object.professionals.count
    end
  end
end
