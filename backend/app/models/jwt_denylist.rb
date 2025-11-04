# frozen_string_literal: true

# JwtDenylist model for JWT token revocation.
# Implements Devise JWT denylist strategy to invalidate tokens on logout.
class JwtDenylist < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist

  self.table_name = 'jwt_denylist'
end
