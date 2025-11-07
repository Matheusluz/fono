# frozen_string_literal: true

# Concern para adicionar auditing automático em models
# Registra quem criou e quem atualizou cada registro
#
# Uso:
#   class Patient < ApplicationRecord
#     include Auditable
#   end
#
# Requer as colunas:
#   - created_by_id (integer, nullable)
#   - updated_by_id (integer, nullable)
module Auditable
  extend ActiveSupport::Concern

  included do
    belongs_to :created_by, class_name: 'User', optional: true
    belongs_to :updated_by, class_name: 'User', optional: true

    before_create :set_created_by
    before_update :set_updated_by
  end

  private

  def set_created_by
    self.created_by = Current.user if Current.user.present?
  end

  def set_updated_by
    self.updated_by = Current.user if Current.user.present?
  end
end
