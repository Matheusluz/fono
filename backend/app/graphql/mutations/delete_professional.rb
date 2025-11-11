# frozen_string_literal: true

module Mutations
  class DeleteProfessional < BaseMutation
    description "Deletes a professional (soft delete by setting active=false)"

    field :success, Boolean, null: false
    field :errors, [String], null: false

    argument :id, ID, required: true

    def resolve(id:)
      require_authentication!
      
      # Apenas admin pode deletar profissionais
      unless current_user.admin?
        return {
          success: false,
          errors: ['Only admins can delete professionals']
        }
      end
      
      professional = Professional.find_by(id: id)
      unless professional
        return {
          success: false,
          errors: ['Professional not found']
        }
      end

      # Soft delete: marcar como inativo
      if professional.deactivate!
        {
          success: true,
          errors: []
        }
      else
        {
          success: false,
          errors: professional.errors.full_messages
        }
      end
    end
  end
end
