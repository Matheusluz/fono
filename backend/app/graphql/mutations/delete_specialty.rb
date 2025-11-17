# frozen_string_literal: true

module Mutations
  class DeleteSpecialty < BaseMutation
    description "Desativa uma especialidade (soft delete)"

    field :success, Boolean, null: false
    field :errors, [String], null: false

    argument :id, ID, required: true

    def resolve(id:)
      require_authentication!

      specialty = Specialty.find_by(id: id)
      
      unless specialty
        return {
          success: false,
          errors: ["Especialidade não encontrada"]
        }
      end

      # Verifica se há profissionais vinculados
      if specialty.professionals.exists?
        return {
          success: false,
          errors: ["Não é possível desativar especialidade com profissionais vinculados"]
        }
      end

      if specialty.update(active: false)
        {
          success: true,
          errors: []
        }
      else
        {
          success: false,
          errors: specialty.errors.full_messages
        }
      end
    end
  end
end
