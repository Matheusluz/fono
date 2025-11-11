# == Schema Information
#
# Table name: professionals
#
#  id                   :bigint           not null, primary key
#  user_id              :bigint           not null
#  specialty            :string           not null
#  council_registration :string
#  bio                  :text
#  active               :boolean          default(TRUE), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class Professional < ApplicationRecord
  belongs_to :user
  
  # Validações
  validates :specialty, presence: true
  validates :user_id, uniqueness: true
  validates :council_registration, uniqueness: { allow_blank: true }
  
  # Escopos
  scope :active, -> { where(active: true) }
  scope :by_specialty, ->(specialty) { where(specialty: specialty) }
  
  # Callbacks
  before_validation :ensure_user_is_professional
  
  # Especialidades comuns (pode mover para enum ou tabela separada no futuro)
  SPECIALTIES = [
    'Fonoaudiologia',
    'Psicologia',
    'Psicopedagogia',
    'Terapia Ocupacional',
    'Nutrição',
    'Fisioterapia'
  ].freeze
  
  # Métodos de instância
  def full_name
    user.email # Pode ser substituído quando User tiver campo 'name'
  end
  
  def deactivate!
    update!(active: false)
  end
  
  def activate!
    update!(active: true)
  end
  
  private
  
  def ensure_user_is_professional
    return unless user
    
    # Garantir que o user associado tem role 'professional'
    unless user.professional?
      errors.add(:user, 'must have professional role')
    end
  end
end
