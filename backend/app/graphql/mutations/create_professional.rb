# frozen_string_literal: true

module Mutations
  class CreateProfessional < BaseMutation
    description "Creates a new professional linked to a user"

    field :professional, Types::ProfessionalType, null: true
    field :errors, [String], null: false

    argument :user_id, ID, required: true
    argument :specialty, String, required: true
    argument :council_registration, String, required: false
    argument :bio, String, required: false

    def resolve(user_id:, specialty:, council_registration: nil, bio: nil)
      require_authentication!
      
      # Apenas admin pode criar profissionais
      unless current_user.admin?
        return {
          professional: nil,
          errors: ['Only admins can create professionals']
        }
      end
      
      user = User.find_by(id: user_id)
      unless user
        return {
          professional: nil,
          errors: ['User not found']
        }
      end
      
      # Garantir que o usuário tem role professional
      unless user.professional?
        user.update(role: :professional)
      end
      
      professional = Professional.new(
        user: user,
        specialty: specialty,
        council_registration: council_registration,
        bio: bio
      )

      if professional.save
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
