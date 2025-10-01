class Patient < ApplicationRecord
  acts_as_paranoid

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, uniqueness: true, allow_nil: true
end
