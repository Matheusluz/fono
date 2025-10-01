module Mutations
  class CreatePatient < BaseMutation
    argument :first_name, String, required: true
    argument :last_name, String, required: true
    argument :birthdate, GraphQL::Types::ISO8601Date, required: false
    argument :email, String, required: false
    argument :phone, String, required: false

    field :patient, Types::PatientType, null: true
    field :errors, [String], null: false

    def resolve(first_name:, last_name:, birthdate: nil, email: nil, phone: nil)
      patient = Patient.new(
        first_name: first_name,
        last_name: last_name,
        birthdate: birthdate,
        email: email,
        phone: phone
      )

      if patient.save
        { patient: patient, errors: [] }
      else
        { patient: nil, errors: patient.errors.full_messages }
      end
    end
  end
end
