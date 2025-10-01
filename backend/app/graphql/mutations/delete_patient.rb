module Mutations
  class DeletePatient < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      patient = Patient.find_by(id: id)
      return { success: false, errors: ["Patient not found"] } unless patient

      patient.destroy
      { success: true, errors: [] }
    end
  end
end
