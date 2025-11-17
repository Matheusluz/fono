# frozen_string_literal: true

module Mutations
  class CreateSpecialty < BaseMutation
    description "Cria uma nova especialidade"

    field :specialty, Types::SpecialtyType, null: true
    field :errors, [String], null: false

    argument :name, String, required: true
    argument :description, String, required: false

    def resolve(name:, description: nil)
      require_authentication!

      specialty = Specialty.new(
        name: name,
        description: description,
        active: true
      )

      if specialty.save
        {
          specialty: specialty,
          errors: []
        }
      else
        {
          specialty: nil,
          errors: specialty.errors.full_messages
        }
      end
    end
  end
end
