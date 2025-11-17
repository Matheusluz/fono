# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts '🌱 Iniciando seeds...'

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
    admin: true,
    role: :admin
  )
  puts "✅ Usuário admin criado: #{admin_email}"
else
  # Atualizar usuário existente para garantir que seja admin
  admin_user.update!(admin: true, role: :admin) unless admin_user.admin?
  puts "✅ Usuário admin atualizado: #{admin_email}"
end

puts "   Credenciais: #{admin_email} / #{admin_password}"
puts '   ⚠️  Lembre-se de alterar a senha padrão em produção!'

# Criar especialidades
puts "\n🎓 Criando especialidades..."

specialties_data = [
  { name: 'Fonoaudiologia', description: 'Especialidade focada em comunicação humana, linguagem, voz, audição e deglutição' },
  { name: 'Psicologia', description: 'Especialidade focada em saúde mental, comportamento e processos mentais' },
  { name: 'Psicopedagogia', description: 'Especialidade focada em processos de aprendizagem e dificuldades escolares' },
  { name: 'Terapia Ocupacional', description: 'Especialidade focada em habilidades funcionais e independência nas atividades diárias' },
  { name: 'Nutrição', description: 'Especialidade focada em alimentação, nutrição e saúde' },
  { name: 'Fisioterapia', description: 'Especialidade focada em movimento, funcionalidade e reabilitação física' }
]

specialties_data.each do |spec_data|
  specialty = Specialty.find_or_initialize_by(name: spec_data[:name])
  
  if specialty.new_record?
    specialty.assign_attributes(
      description: spec_data[:description],
      active: true
    )
    specialty.save!
    puts "✅ Especialidade criada: #{spec_data[:name]}"
  else
    specialty.update!(active: true) unless specialty.active?
    puts "✅ Especialidade já existe: #{spec_data[:name]}"
  end
end

# Criar profissionais de exemplo
puts "\n📋 Criando profissionais de exemplo..."

professionals_data = [
  {
    email: 'maria.silva@fono.com',
    password: 'senha123',
    specialty_name: 'Fonoaudiologia',
    council_registration: 'CRFa 2-12345',
    bio: 'Fonoaudióloga especializada em linguagem infantil e disfagia. 10 anos de experiência.'
  },
  {
    email: 'joao.santos@fono.com',
    password: 'senha123',
    specialty_name: 'Psicologia',
    council_registration: 'CRP 06/123456',
    bio: 'Psicólogo clínico com abordagem cognitivo-comportamental. Atendimento a adolescentes e adultos.'
  },
  {
    email: 'ana.costa@fono.com',
    password: 'senha123',
    specialty_name: 'Fonoaudiologia',
    council_registration: 'CRFa 2-54321',
    bio: 'Fonoaudióloga especializada em audiologia e reabilitação auditiva.'
  },
  {
    email: 'carlos.oliveira@fono.com',
    password: 'senha123',
    specialty_name: 'Psicopedagogia',
    council_registration: nil,
    bio: 'Psicopedagogo com foco em dificuldades de aprendizagem e transtornos do neurodesenvolvimento.'
  }
]

professionals_data.each do |prof_data|
  user = User.find_or_initialize_by(email: prof_data[:email])
  
  if user.new_record?
    user.assign_attributes(
      password: prof_data[:password],
      password_confirmation: prof_data[:password],
      role: :professional,
      admin: false
    )
    user.save!
    puts "✅ Usuário profissional criado: #{prof_data[:email]}"
  else
    user.update!(role: :professional) unless user.professional?
    puts "✅ Usuário profissional atualizado: #{prof_data[:email]}"
  end
  
  # Buscar a especialidade pelo nome
  specialty = Specialty.find_by(name: prof_data[:specialty_name])
  
  unless specialty
    puts "   ⚠️  Especialidade '#{prof_data[:specialty_name]}' não encontrada, pulando..."
    next
  end
  
  # Criar ou atualizar professional
  professional = user.professional || user.build_professional
  professional.assign_attributes(
    specialty: specialty,
    council_registration: prof_data[:council_registration],
    bio: prof_data[:bio],
    active: true
  )
  professional.save!
  puts "   Especialidade: #{specialty.name}"
end

puts "\n✨ Seeds concluídos!"
puts "📊 Resumo:"
puts "   Especialidades: #{Specialty.count}"
puts "   Admin: #{User.admin.count}"
puts "   Profissionais: #{User.professional.count}"
puts "   Assistentes: #{User.assistant.count}"
puts "   Total de profiles profissionais: #{Professional.count}"
