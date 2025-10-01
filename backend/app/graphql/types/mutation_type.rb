# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_patient, mutation: Mutations::CreatePatient
    field :update_patient, mutation: Mutations::UpdatePatient
    field :delete_patient, mutation: Mutations::DeletePatient
    field :restore_patient, mutation: Mutations::RestorePatient
  end
end
