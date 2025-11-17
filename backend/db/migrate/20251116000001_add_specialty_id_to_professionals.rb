class AddSpecialtyIdToProfessionals < ActiveRecord::Migration[7.0]
  def change
    add_reference :professionals, :specialty, foreign_key: true
    
    # Migrar dados existentes (opcional - criar especialidades a partir dos dados)
    reversible do |dir|
      dir.up do
        # Criar especialidades únicas a partir dos profissionais existentes
        execute <<-SQL
          INSERT INTO specialties (name, active, created_at, updated_at)
          SELECT DISTINCT specialty, true, NOW(), NOW()
          FROM professionals
          WHERE specialty IS NOT NULL AND specialty != ''
          ON CONFLICT DO NOTHING;
        SQL
        
        # Vincular profissionais às especialidades criadas
        execute <<-SQL
          UPDATE professionals p
          SET specialty_id = s.id
          FROM specialties s
          WHERE p.specialty = s.name;
        SQL
      end
    end
    
    # Remover coluna antiga specialty (string) - descomente após migração
    # remove_column :professionals, :specialty, :string
  end
end
