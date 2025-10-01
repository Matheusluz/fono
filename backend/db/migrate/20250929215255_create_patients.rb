class CreatePatients < ActiveRecord::Migration[7.1]
  def change
    create_table :patients do |t|
      t.string :first_name
      t.string :last_name
      t.date :birthdate
      t.string :email
      t.string :phone
      t.datetime :deleted_at

      t.timestamps
    end
    add_index :patients, :deleted_at
  end
end
