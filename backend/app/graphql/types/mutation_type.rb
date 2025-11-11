# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_patient, mutation: Mutations::CreatePatient
    field :update_patient, mutation: Mutations::UpdatePatient
    field :delete_patient, mutation: Mutations::DeletePatient
    field :restore_patient, mutation: Mutations::RestorePatient
    field :register_user, mutation: Mutations::RegisterUser
    field :update_user, mutation: Mutations::UpdateUser
    field :delete_user, mutation: Mutations::DeleteUser
    field :login_user, mutation: Mutations::LoginUser
    field :logout_user, mutation: Mutations::LogoutUser
    field :create_professional, mutation: Mutations::CreateProfessional
    field :update_professional, mutation: Mutations::UpdateProfessional
    field :delete_professional, mutation: Mutations::DeleteProfessional
  end
end
