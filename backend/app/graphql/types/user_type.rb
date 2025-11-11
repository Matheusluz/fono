module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    field :admin, Boolean, null: false
    field :role, String, null: false
    field :professional, Types::ProfessionalType, null: true
    
    def role
      object.role
    end
  end
end
