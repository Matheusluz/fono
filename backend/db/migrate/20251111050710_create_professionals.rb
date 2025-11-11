class CreateProfessionals < ActiveRecord::Migration[7.1]
  def change
    create_table :professionals do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.string :specialty, null: false
      t.string :council_registration
      t.text :bio
      t.boolean :active, default: true, null: false

      t.timestamps
    end
    
    add_index :professionals, :specialty
    add_index :professionals, :active
  end
end
