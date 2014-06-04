class CreateSessions < ActiveRecord::Migration
  def change
    create_table :sessions do |t|
      t.references :structure, index: true
      t.string :url
      t.text :stenograph
      t.date :date

      t.timestamps
    end
  end
end
