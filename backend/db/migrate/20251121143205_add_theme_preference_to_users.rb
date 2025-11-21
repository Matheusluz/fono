class AddThemePreferenceToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :theme_preference, :string, default: 'light', null: false
    add_index :users, :theme_preference
  end
end
