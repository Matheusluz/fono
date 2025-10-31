# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Criar usuário admin padrão
admin_email = ENV['ADMIN_EMAIL'] || 'admin@fono.com'
admin_password = ENV['ADMIN_PASSWORD'] || 'admin123456'

# Buscar ou criar o usuário admin
admin_user = User.find_by(email: admin_email)

if admin_user.nil?
  # Criar novo usuário admin
  admin_user = User.create!(
    email: admin_email,
    password: admin_password,
    password_confirmation: admin_password,
    admin: true
  )
  puts "✅ Usuário admin criado: #{admin_email}"
else
  # Atualizar usuário existente para garantir que seja admin
  admin_user.update!(admin: true) unless admin_user.admin?
  puts "✅ Usuário admin atualizado: #{admin_email}"
end

puts "   Credenciais: #{admin_email} / #{admin_password}"
puts "   ⚠️  Lembre-se de alterar a senha padrão em produção!"
