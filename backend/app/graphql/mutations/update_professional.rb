# frozen_string_literal: true

module Mutations
  class UpdateProfessional < BaseMutation
    description "Updates an existing professional"

    field :professional, Types::ProfessionalType, null: true
    field :errors, [String], null: false

    argument :id, ID, required: true
    argument :specialty_id, ID, required: false
    argument :council_registration, String, required: false
    argument :bio, String, required: false
    argument :active, Boolean, required: false

    def resolve(id:, **attributes)
      require_authentication!
      
      professional = Professional.find_by(id: id)
      unless professional
        return {
          professional: nil,
          errors: ['Professional not found']
        }
      end
      
      # Admin pode editar qualquer profissional
      # Profissional pode editar apenas seu próprio perfil
      unless current_user.admin? || professional.user_id == current_user.id
        return {
          professional: nil,
          errors: ['Not authorized to update this professional']
        }
      end

      if professional.update(attributes.compact)
        {
          professional: professional,
          errors: []
        }
      else
        {
          professional: nil,
          errors: professional.errors.full_messages
        }
      end
    end
  end
end
