module Mutations
  class RestorePatient < BaseMutation
    argument :id, ID, required: true

    field :patient, Types::PatientType, null: true
    field :errors, [String], null: false

    def resolve(id:)
      require_authentication!

      patient = Patient.only_deleted.find_by(id: id)
      return { patient: nil, errors: ["Patient not found or not deleted"] } unless patient

      patient.restore
      { patient: patient, errors: [] }
    end
  end
end
