class Specialty < ApplicationRecord
  has_many :professionals, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :name, length: { minimum: 2, maximum: 100 }

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(name: :asc) }

  before_validation :normalize_name

  private

  def normalize_name
    self.name = name.strip.titleize if name.present?
  end
end
