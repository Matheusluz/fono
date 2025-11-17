# frozen_string_literal: true

module Mutations
  class UpdateSpecialty < BaseMutation
    description "Atualiza uma especialidade existente"

    field :specialty, Types::SpecialtyType, null: true
    field :errors, [String], null: false

    argument :id, ID, required: true
    argument :name, String, required: false
    argument :description, String, required: false
    argument :active, Boolean, required: false

    def resolve(id:, **attributes)
      require_authentication!

      specialty = Specialty.find_by(id: id)
      
      unless specialty
        return {
          specialty: nil,
          errors: ["Especialidade não encontrada"]
        }
      end

      if specialty.update(attributes.compact)
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
