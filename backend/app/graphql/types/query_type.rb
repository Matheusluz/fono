# frozen_string_literal: true

module Types
  # QueryType define todas as queries disponíveis na API GraphQL
  # Inclui queries para buscar pacientes, usuários e informações do usuário atual
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: 'Fetches an object given its ID.' do
      argument :id, ID, required: true, description: 'ID of the object.'
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: 'Fetches a list of objects given a list of IDs.' do
      argument :ids, [ID], required: true, description: 'IDs of the objects.'
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # Todos pacientes (ignora deletados)
    field :patients, [Types::PatientType], null: false

    def patients
      require_authentication!
      Patient.all
    end

    # Buscar paciente por ID
    field :patient, Types::PatientType, null: true do
      argument :id, ID, required: true
    end

    def patient(id:)
      require_authentication!
      Patient.find_by(id: id)
    end

    # Todos pacientes incluindo deletados
    field :patients_with_deleted, [Types::PatientType], null: false

    def patients_with_deleted
      require_authentication!
      Patient.with_deleted
    end

    # Query para usuário atual (precisa estar autenticado)
    field :current_user, Types::UserType, null: true

    def current_user
      context[:current_user]
    end

    # Todos usuários (precisa estar autenticado)
    field :users, [Types::UserType], null: false

    def users
      require_authentication!
      User.all
    end
    
    # Todos profissionais ativos
    field :professionals, [Types::ProfessionalType], null: false do
      argument :include_inactive, Boolean, required: false, default_value: false
    end
    
    def professionals(include_inactive: false)
      require_authentication!
      include_inactive ? Professional.all : Professional.active
    end
    
    # Buscar profissional por ID
    field :professional, Types::ProfessionalType, null: true do
      argument :id, ID, required: true
    end
    
    def professional(id:)
      require_authentication!
      Professional.find_by(id: id)
    end
    
    # Buscar profissionais por especialidade
    field :professionals_by_specialty, [Types::ProfessionalType], null: false do
      argument :specialty, String, required: true
    end
    
    def professionals_by_specialty(specialty:)
      require_authentication!
      Professional.active.by_specialty(specialty)
    end
  end
end
