# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # Todos pacientes (ignora deletados)
    field :patients, [Types::PatientType], null: false

    def patients
      Patient.all
    end

    # Buscar paciente por ID
    field :patient, Types::PatientType, null: true do
      argument :id, ID, required: true
    end

    def patient(id:)
      Patient.find_by(id: id)
    end

    # Todos pacientes incluindo deletados
    field :patients_with_deleted, [Types::PatientType], null: false

    def patients_with_deleted
      Patient.with_deleted
    end
  end
end
