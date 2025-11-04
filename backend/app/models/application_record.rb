# frozen_string_literal: true

# Base class for all application models.
# Inherits from ActiveRecord::Base and serves as the primary abstract class.
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end
