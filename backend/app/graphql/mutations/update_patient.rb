module Mutations
  class UpdatePatient < BaseMutation
    argument :id, ID, required: true
    argument :first_name, String, required: false
    argument :last_name, String, required: false
    argument :birthdate, GraphQL::Types::ISO8601Date, required: false
    argument :email, String, required: false
    argument :phone, String, required: false

    field :patient, Types::PatientType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      require_authentication!

      patient = Patient.find_by(id: id)
      return { patient: nil, errors: ["Patient not found"] } unless patient

      if patient.update(attributes)
        { patient: patient, errors: [] }
      else
        { patient: nil, errors: patient.errors.full_messages }
      end
    end
  end
end
